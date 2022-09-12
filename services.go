package main

import (
	"context"
	"fmt"
	"os"
	"os/exec"
	"syscall"

	rt "runtime"

	logger "github.com/apigear-io/cli/pkg/log"
	"github.com/apigear-io/cli/pkg/mon"
	"github.com/apigear-io/cli/pkg/net"
	"github.com/apigear-io/cli/pkg/sim"
	"github.com/apigear-io/cli/pkg/sol"
	"github.com/apigear-io/wsrpc/rpc"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var server *net.Server
var simulation = sim.NewSimulation()
var monitorStarted bool
var runner = sol.NewRunner()
var serviceCancel context.CancelFunc
var serviceCtx context.Context

func init() {
	serviceCtx, serviceCancel = context.WithCancel(context.Background())
}

// TODO: rethink context used here, many we can just create new contexts with timeouts

func StartServices(ctx context.Context, port string) error {
	log.Info("start background services")
	server = net.NewHTTPServer()
	err := RegisterLogService(ctx)
	if err != nil {
		return fmt.Errorf("failed to start log service: %s", err)
	}
	err = RegisterMonitorService(ctx)
	if err != nil {
		return fmt.Errorf("failed to start monitor service: %v", err)
	}
	err = RegisterSimulationService()
	if err != nil {
		return fmt.Errorf("failed to start simulation service: %v", err)
	}
	err = RunServer(fmt.Sprintf(":%s", port))
	if err != nil {
		return fmt.Errorf("failed to start server: %v", err)
	}
	return nil
}

func StopServices() {
	log.Info("stop background services")
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
	log.Infof("start server on %s", addr)
	err := server.Start(addr)
	if err != nil {
		log.Errorf("failed to start server: %v", err)
	}
	return nil
}

func RestartServer(ctx context.Context, addr string) error {
	log.Infof("restart server on %s", addr)
	if server == nil {
		return fmt.Errorf("server not started")
	}
	return server.Restart(ctx, addr)
}

func RegisterMonitorService(ctx context.Context) error {
	log.Info("start monitor service")
	if server == nil {
		return fmt.Errorf("server not started")
	}
	if monitorStarted {
		return fmt.Errorf("monitor service already started")
	}
	monitorStarted = true
	server.Router().Post("/monitor/{source}/", net.HandleMonitorRequest)
	log.Infof("handle monitor request on %s/monitor/{source}", server.Address())
	go func(emitter chan *mon.Event) {
		// capture mon events and send to app
		for event := range emitter {
			log.Debugf("send monitor event: %v", event)
			runtime.EventsEmit(ctx, "mon", event)
		}
	}(mon.Emitter())
	return nil
}

func RegisterSimulationService() error {
	log.Info("start simulation service")
	if server == nil {
		return fmt.Errorf("server not started")
	}
	if simulation != nil {
		return fmt.Errorf("simulation already started")
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
	log.Debugf("handle ws rpc server on %s/ws/", server.Address())
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
	logger.OnReport(func(report *logger.ReportEntry) {
		runtime.EventsEmit(ctx, "log", report)
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
