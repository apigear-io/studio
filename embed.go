//go:build !bindings

package main

import "embed"

//go:embed frontend/dist/spa
var assets embed.FS

//go:embed appicon.png
var icon []byte
