package main

import (
	"fmt"
	"runtime/debug"

	"github.com/apigear-io/cli/pkg/cfg"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

const (
	CLI_PATH = "github.com/apigear-io/cli"
)

var (
	// build information
	version = "v0.0.0"
	commit  = "123456"
	date    = "2021.01.01"
)

func ParseCliBuildInfo() error {
	bi, ok := debug.ReadBuildInfo()
	if !ok {
		return fmt.Errorf("no build info")
	}
	for _, m := range bi.Deps {
		if m.Path == CLI_PATH {
			cliVersion := m.Version
			if cliVersion == "(devel)" {
				cliVersion = ""
			}
			cfg.SetBuildInfo("cli", cfg.BuildInfo{
				Version: cliVersion,
				Commit:  "",
				Date:    date,
			})
			break
		}
	}
	return nil
}

func main() {
	// Parse build information from cli
	err := ParseCliBuildInfo()
	if err != nil {
		log.Error().Err(err).Msg("parse cli build info")
	}

	cfg.SetBuildInfo("studio", cfg.BuildInfo{
		Version: version,
		Commit:  commit,
		Date:    date,
	})
	log.Info().Msgf("Version: %s, Commit: %s, Date: %s", version, commit, date)

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err = wails.Run(&options.App{
		Title:     "ApiGear Studio",
		Width:     1280,
		Height:    800,
		MinWidth:  960,
		MinHeight: 720,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 255},
		OnStartup:        app.startup,
		OnShutdown:       app.shutdown,
		Frameless:        false,
		Bind: []interface{}{
			app,
		},
		Windows: &windows.Options{
			Theme:                             windows.SystemDefault,
			WebviewIsTransparent:              false,
			WindowIsTranslucent:               false,
			DisableFramelessWindowDecorations: false,
			CustomTheme: &windows.ThemeSettings{
				DarkModeTitleBar:   windows.RGB(20, 20, 20),
				DarkModeTitleText:  windows.RGB(200, 200, 200),
				DarkModeBorder:     windows.RGB(20, 0, 20),
				LightModeTitleBar:  windows.RGB(200, 200, 200),
				LightModeTitleText: windows.RGB(20, 20, 20),
				LightModeBorder:    windows.RGB(200, 200, 200),
			},
		},
		Mac: &mac.Options{
			TitleBar: mac.TitleBarDefault(),
			About: &mac.AboutInfo{
				Title:   "ApiGear Studio",
				Message: "(c) 2022 ApiGear",
				Icon:    icon,
			},
			WindowIsTranslucent:  false,
			WebviewIsTransparent: true,
		},
	})

	if err != nil {
		log.Error().Msgf("start application: %s", err.Error())
	}
}
