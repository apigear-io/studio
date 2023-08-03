//go:build !bindings

package main

import "embed"

//go:embed frontend/dist
var assets embed.FS

//go:embed appicon.png
var icon []byte
