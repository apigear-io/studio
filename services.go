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
	"github.com/apigear-io/cli/pkg/net"
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
	runner     = sol.NewRunner()
	updateInfo = &UpdateInfo{}
)

// TODO: stop using getManager, will kepp a singelton instance of the manager, cretae maanager when services start
func StartServices(app *App) error {
	log.Info().Msg("start background services")
	err := RegisterLogService(app.ctx)
	if err != nil {
		log.Error().Err(err).Msg("register log service")
	}
	netman := app.NetworkManager()

	err = netman.Start(net.DefaultOptions)
	if err != nil {
		log.Error().Err(err).Msg("start network manager")
		return err
	}

	log.Info().Msg("start simulation service")
	simman := app.SimulationManager()
	simman.Start(netman)

	log.Info().Msg("start updater ...")
	err = StartUpdater(app.ctx)
	if err != nil {
		log.Error().Err(err).Msg("start updater")
	}
	return nil
}

func StopServices(app *App) {
	log.Info().Msg("stop background services")
	app.NetworkManager().Stop()
	app.SimulationManager().Stop()
	if runner != nil {
		runner.Clear()
	}
}

func StartUpdater(ctx context.Context) error {
	log.Info().Msg("start updater")
	updateInfo.CheckComplete = false
	bi := cfg.GetBuildInfo("studio")
	u, err := up.NewUpdater("apigear-io/studio", bi.Version)
	log.Info().Msgf("current version: %s", bi.Version)
	if err != nil {
		log.Error().Msgf("create updater: %v", err)
		return fmt.Errorf("create updater: %v", err)
	}
	log.Info().Msgf("xxx updater: %v", u)
	updateInfo.Updater = u
	r, err := u.Check(ctx)
	if err != nil {
		log.Error().Err(err).Msg("check for update")
	}
	log.Info().Msgf("latest release: %v", r)
	updateInfo.LatestRelease = r
	updateInfo.CheckComplete = true
	return err
}

func RestartServer(app *App, addr string) error {
	log.Info().Msgf("restart server on %s", addr)
	err := app.NetworkManager().Stop()
	if err != nil {
		log.Error().Err(err).Msg("stop server")
	}
	return app.NetworkManager().Start(net.DefaultOptions)
}

func RegisterSimulationService(app *App) error {
	log.Info().Msg("start simulation manager")
	// if server == nil {
	// 	log.Error().Msg("server not started")
	// 	return fmt.Errorf("server not started")
	// }
	// if simulation == nil {
	// 	log.Error().Msg("simulation not started")
	// 	return nil
	// }
	// hub := net.NewSimuHub(ctx, simulation)
	// server.Router().HandleFunc("/ws", hub.ServeHTTP)
	// log.Debug().Msgf("simulation server listening on %s/ws", server.Address())
	// log.Info().Msg("register simulation events")
	// simulation.OnEvent(func(evt *core.SimuEvent) {
	// 	log.Info().Msgf("send simulation event: %v", evt)
	// 	runtime.EventsEmit(ctx, "sim", evt)
	// })
	return nil
}

func RegisterLogService(ctx context.Context) error {
	log.Info().Msg("start log service")
	zlog.OnReportBytes(func(s string) {
		fmt.Printf("log msg: %s", s)
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

func GetRunner() *sol.Runner {
	return runner
}

func CheckAppUpdate() (*ReleaseInfo, error) {
	if !updateInfo.CheckComplete {
		return nil, fmt.Errorf("update check not complete")
	}
	if updateInfo.LatestRelease == nil {
		// no update available
		return nil, fmt.Errorf("no update available")
	}
	rel := updateInfo.LatestRelease
	return &ReleaseInfo{
		Version:      rel.Version(),
		PublishedAt:  rel.PublishedAt,
		ReleaseNotes: rel.ReleaseNotes,
		URL:          rel.URL,
	}, nil
}

func UpdateApp(ctx context.Context, version string) error {
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
	err := updateInfo.Updater.Update(ctx, updateInfo.LatestRelease)
	if err != nil {
		return err
	}
	return RestartSelf()
}
