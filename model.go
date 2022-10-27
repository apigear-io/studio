package main

import "time"

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

// RepoInfo represents a template
type RepoInfo struct {
	Name        string   `json:"name"`
	Description string   `json:"description"`
	Source      string   `json:"source"`
	Path        string   `json:"path"`
	Installed   bool     `json:"installed"`
	Available   bool     `json:"available"`
	Versions    []string `json:"versions"`
}

type VersionInfo struct {
	Version string `json:"version"`
	Commit  string `json:"commit"`
	Date    string `json:"date"`
}

type ReleaseInfo struct {
	Version      string    `json:"version"`
	PublishedAt  time.Time `json:"published_at"`
	ReleaseNotes string    `json:"release_notes"`
	URL          string    `json:"url"`
}

type CheckResult struct {
	IsValid bool     `json:"is_valid"`
	Errors  []string `json:"errors"`
}
