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
	"github.com/apigear-io/cli/pkg/sim/core"
	"github.com/apigear-io/cli/pkg/sol"
	"github.com/apigear-io/cli/pkg/up"
	"github.com/creativeprojects/go-selfupdate"
	"github.com/pkg/browser"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// UpdateInfo contains information available update
type UpdateInfo struct {
	// Updater is the updater
	Updater *up.Updater
	// LatestRelease is the latest release available or nil if no update is available
	LatestRelease *selfupdate.Release
	// CheckComplete is true if the check for update has been completed
	CheckComplete bool
}

var (
	server         *net.Server
	simulation     = sim.NewSimulation()
	monitorStarted bool
	runner         = sol.NewRunner()
	serviceCancel  context.CancelFunc
	serviceCtx     context.Context
	updateInfo     = &UpdateInfo{}
)

func init() {
	serviceCtx, serviceCancel = context.WithCancel(context.Background())
}

func StartServices(ctx context.Context, port string) error {
	log.Info().Msg("start background services")
	log.Info().Msg("start updater")
	err := StartUpdater()
	if err != nil {
		return err
	}
	server = net.NewHTTPServer()
	err = RegisterLogService(ctx)
	if err != nil {
		return err
	}
	err = RegisterMonitorService(ctx)
	if err != nil {
		return err
	}
	err = RegisterSimulationService(ctx)
	if err != nil {
		return err
	}
	err = RunServer(fmt.Sprintf(":%s", port))
	if err != nil {
		return err
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

func StartUpdater() error {
	updateInfo.CheckComplete = false
	u, err := up.NewUpdater("apigear-io/studio-releases", cfg.BuildVersion())
	if err != nil {
		return fmt.Errorf("create updater: %v", err)
	}
	updateInfo.Updater = u
	r, err := u.Check()
	if err != nil {
		return fmt.Errorf("check for update: %v", err)
	}
	updateInfo.LatestRelease = r
	updateInfo.CheckComplete = true
	return nil
}

func RunServer(addr string) error {
	log.Info().Msgf("start http server on %s", addr)
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
	return server.Restart(serviceCtx, addr)
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

func RegisterSimulationService(ctx context.Context) error {
	log.Info().Msg("start simulation service")
	if server == nil {
		log.Error().Msg("server not started")
		return fmt.Errorf("server not started")
	}
	if simulation == nil {
		log.Error().Msg("simulation not started")
		return nil
	}
	handler := net.NewSimuRpcHandler(simulation)
	hub := rpc.NewHub(serviceCtx)
	go func() {
		for req := range hub.Requests() {
			// ends with closing of requests
			err := handler.HandleMessage(req)
			if err != nil {
				log.Error().Err(err).Msg("handle simulation request")
			}
		}
	}()
	server.Router().HandleFunc("/ws", hub.ServeHTTP)
	log.Debug().Msgf("simulation server listening on %s/ws", server.Address())
	log.Info().Msg("register simulation events")
	simulation.OnEvent(func(evt *core.SimuEvent) {
		log.Info().Msgf("send simulation event: %v", evt)
		runtime.EventsEmit(ctx, "sim", evt)
	})
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
	addr := fmt.Sprintf("ws://%s/ws", server.Address())
	log.Info().Msgf("simulation address: %s", addr)
	return addr, nil
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
	if !updateInfo.CheckComplete {
		return nil, fmt.Errorf("update check not complete")
	}
	if updateInfo.LatestRelease == nil {
		// no update available
		return nil, nil
	}
	rel := updateInfo.LatestRelease
	return &ReleaseInfo{
		Version:      rel.Version(),
		PublishedAt:  rel.PublishedAt,
		ReleaseNotes: rel.ReleaseNotes,
		URL:          rel.URL,
	}, nil
}

func UpdateApp(version string) error {
	if rt.GOOS == "windows" {
		// workaround for windows as update process fails when app is installed
		// on open browser to github release page
		rel := updateInfo.LatestRelease
		if rel == nil {
			return fmt.Errorf("no update available")
		}
		return browser.OpenURL(rel.URL)
	}
	if !updateInfo.CheckComplete {
		return fmt.Errorf("update check not complete")
	}
	if updateInfo.Updater == nil {
		return fmt.Errorf("no updater")
	}
	if updateInfo.LatestRelease == nil {
		return fmt.Errorf("no update available. update not possible")
	}
	if version == "" {
		return fmt.Errorf("version not specified")
	}
	err := updateInfo.Updater.Update(updateInfo.LatestRelease)
	if err != nil {
		return err
	}
	return RestartSelf()
}
