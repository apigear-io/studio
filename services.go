package main

import (
	"context"
	"fmt"

	"github.com/apigear-io/cli/pkg/log"
	"github.com/apigear-io/cli/pkg/mon"
	"github.com/apigear-io/cli/pkg/net"
	"github.com/apigear-io/cli/pkg/net/rpc"
	"github.com/apigear-io/cli/pkg/sim"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

var server *net.Server
var simulation *sim.Simulation
var monitorStarted bool

// TODO: rethink context used here, many we can just create new contexts with timeouts

func StartServices(ctx context.Context, port int) error {
	log.Info("start services")
	server = net.NewHTTPServer()
	err := RegisterMonitorService(ctx)
	if err != nil {
		return fmt.Errorf("failed to start monitor service: %v", err)
	}
	err = RegisterSimulationService()
	if err != nil {
		return fmt.Errorf("failed to start simulation service: %v", err)
	}
	err = RunServer(fmt.Sprintf(":%d", port))
	if err != nil {
		return fmt.Errorf("failed to start server: %v", err)
	}
	return nil
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
	simulation = sim.NewSimulation()
	handler := net.NewSimuRpcHandler(simulation)
	hub := rpc.NewHub(handler)
	server.Router().HandleFunc("/ws/", hub.HandleWebsocketRequest)
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
