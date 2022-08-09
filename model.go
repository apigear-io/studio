package main

// DocumentInfo represents a document's metadata.
type DocumentInfo struct {
	Name string `json:"name"`
	Path string `json:"path"`
	Type string `json:"type"`
}

// ProjectInfo represents a project information
type ProjectInfo struct {
	Path      string         `json:"path"`
	Name      string         `json:"name"`
	Documents []DocumentInfo `json:"documents"`
}

// AppSettings is the settings for the application exposed to the UI
type AppSettings struct {
	ServerPort    string `json:"server_port"`
	UpdateChannel string `json:"update_channel"`
	EditorCommand string `json:"editor_command"`
}

// TemplateInfo represents a template
type TemplateInfo struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Source      string `json:"source"`
	Path        string `json:"path"`
	Installed   bool   `json:"installed"`
	Available   bool   `json:"available"`
}
