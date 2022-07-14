package main

type DocumentInfo struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Type string `json:"type"`
}

type Project struct {
	Path      string         `json:"path"`
	Name      string         `json:"name"`
	Documents []DocumentInfo `json:"documents"`
}

type AppSettings struct {
	ServerPort    int    `json:"server_port"`
	UpdateChannel string `json:"update_channel"`
	EditorCommand string `json:"editor_command"`
}
