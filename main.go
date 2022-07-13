package main

import (
	"embed"

	"github.com/apigear-io/cli/pkg/config"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed frontend/dist/spa
var assets embed.FS

//go:embed appicon.png
var icon []byte

func main() {
	// Create an instance of the app structure
	app := NewApp()
	config.InitConfig()

	// Create application with options
	err := wails.Run(&options.App{
		Title:            "ApiGear Studio",
		Width:            1280,
		Height:           800,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 255},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Mac: &mac.Options{
			TitleBar: mac.TitleBarDefault(),
			About: &mac.AboutInfo{
				Title:   "ApiGear Studio",
				Message: "(c) 2020 ApiGear",
				Icon:    icon,
			},
		},
	})

	if err != nil {
		println("Error:", err)
	}
}
