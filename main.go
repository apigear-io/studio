package main

import (
	"github.com/apigear-io/cli/pkg/cfg"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

var (
	// build information
	version = "v0.0.0"
	commit  = "123456"
	date    = "2021.01.01"
)

func main() {
	cfg.SetBuildInfo(version, commit, date)
	log.Info().Msgf("Version: %s, Commit: %s, Date: %s", version, commit, date)

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
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
