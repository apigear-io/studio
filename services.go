package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"syscall"

	rt "runtime"

	"github.com/apigear-io/cli/pkg/cfg"
	zlog "github.com/apigear-io/cli/pkg/log"
	"github.com/apigear-io/cli/pkg/mon"
	"github.com/apigear-io/cli/pkg/net"
	"github.com/apigear-io/cli/pkg/net/rpc"
	"github.com/apigear-io/cli/pkg/sim"
	"github.com/apigear-io/cli/pkg/sol"
	"github.com/apigear-io/cli/pkg/up"
	"github.com/creativeprojects/go-selfupdate"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var server *net.Server
var simulation = sim.NewSimulation()
var monitorStarted bool
var runner = sol.NewRunner()
var serviceCancel context.CancelFunc
var serviceCtx context.Context
var updater *up.Updater
var latestRelease *selfupdate.Release

func StartUpdater() error {
	serviceCtx, serviceCancel = context.WithCancel(context.Background())
	u, err := up.NewUpdater("apigear-io/studio-releases", cfg.BuildVersion())
	if err != nil {
		return fmt.Errorf("create updater: %v", err)
	}
	updater = u
	r, err := updater.Check()
	if err != nil {
		return fmt.Errorf("check for update: %v", err)
	}
	latestRelease = r
	return nil
}

// TODO: rethink context used here, many we can just create new contexts with timeouts

func StartServices(ctx context.Context, port string) error {
	log.Info().Msg("start background services")
	err := StartUpdater()
	if err != nil {
		return fmt.Errorf("start updater: %v", err)
	}
	server = net.NewHTTPServer()
	err = RegisterLogService(ctx)
	if err != nil {
		return fmt.Errorf("start log service: %s", err)
	}
	err = RegisterMonitorService(ctx)
	if err != nil {
		return fmt.Errorf("start monitor service: %v", err)
	}
	err = RegisterSimulationService()
	if err != nil {
		return fmt.Errorf("start simulation service: %v", err)
	}
	err = RunServer(fmt.Sprintf(":%s", port))
	if err != nil {
		return fmt.Errorf("start server: %v", err)
	}
	return nil
}

func StopServices() {
	log.Info().Msg("stop background services")
	if server != nil {
		server.Stop()
	}
	if simulation != nil {
		simulation.Stop()
	}
	if runner != nil {
		runner.Clear()
	}
	if serviceCancel != nil {
		serviceCancel()
	}
}

func RunServer(addr string) error {
	log.Info().Msgf("start server on %s", addr)
	err := server.Start(addr)
	if err != nil {
		log.Error().Msgf("start server: %v", err)
	}
	return nil
}

func RestartServer(ctx context.Context, addr string) error {
	log.Info().Msgf("restart server on %s", addr)
	if server == nil {
		return fmt.Errorf("server not started")
	}
	return server.Restart(ctx, addr)
}

func RegisterMonitorService(ctx context.Context) error {
	log.Info().Msg("start monitor service")
	if server == nil {
		return fmt.Errorf("server not started")
	}
	if monitorStarted {
		return fmt.Errorf("monitor service already started")
	}
	monitorStarted = true
	server.Router().Post("/monitor/{source}/", net.HandleMonitorRequest)
	log.Info().Msgf("handle monitor request on %s/monitor/{source}", server.Address())
	go func(emitter chan *mon.Event) {
		// capture mon events and send to app
		for event := range emitter {
			log.Debug().Msgf("send monitor event: %v", event)
			runtime.EventsEmit(ctx, "mon", event)
		}
	}(mon.Emitter())
	return nil
}

func RegisterSimulationService() error {
	log.Info().Msg("start simulation service")
	if server == nil {
		return fmt.Errorf("server not started")
	}
	if simulation != nil {
		return nil
	}
	handler := net.NewSimuRpcHandler(simulation)
	hub := rpc.NewHub(serviceCtx)
	go func() {
		for req := range hub.Requests() {
			// ends with closing of requests
			handler.HandleMessage(req)
		}
	}()
	server.Router().HandleFunc("/ws/", hub.ServeHTTP)
	log.Debug().Msgf("handle ws rpc server on %s/ws/", server.Address())
	return nil
}

func GetMonitorAddress() (string, error) {
	if server == nil {
		return "", fmt.Errorf("server not started")
	}
	return fmt.Sprintf("http://%s/monitor/${source}/", server.Address()), nil
}

func GetSimulationAddress() (string, error) {
	if server == nil {
		return "", fmt.Errorf("server not started")
	}
	return fmt.Sprintf("ws://%s/ws/", server.Address()), nil
}

func RegisterLogService(ctx context.Context) error {
	log.Info().Msg("start log service")
	zlog.OnReportBytes(func(s string) {
		runtime.EventsEmit(ctx, "log", s)
	})
	return nil
}

func RestartSelf() error {
	self, err := os.Executable()
	if err != nil {
		return err
	}
	args := os.Args
	env := os.Environ()
	// Windows does not support exec syscall.
	if rt.GOOS == "windows" {
		cmd := exec.Command(self, args[1:]...)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		cmd.Stdin = os.Stdin
		cmd.Env = env
		err := cmd.Run()
		if err == nil {
			os.Exit(0)
		}
		return err
	}
	return syscall.Exec(self, args, env)
}

func GetSimulation() *sim.Simulation {
	return simulation
}

func GetRunner() *sol.Runner {
	return runner
}

func CheckAppUpdate() (*ReleaseInfo, error) {
	if latestRelease == nil {
		return nil, nil
	}
	return &ReleaseInfo{
		Version:      latestRelease.Version(),
		PublishedAt:  latestRelease.PublishedAt,
		ReleaseNotes: latestRelease.ReleaseNotes,
		URL:          latestRelease.URL,
	}, nil
}

func UpdateApp(version string) error {
	if updater == nil {
		return fmt.Errorf("updater not initialized")
	}
	err := updater.Update(latestRelease)
	if err != nil {
		return err
	}
	return RestartSelf()
}
