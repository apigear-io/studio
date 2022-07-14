package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/apigear-io/cli/pkg/config"
	"github.com/apigear-io/cli/pkg/log"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	currentProject *Project
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	err := StartServices(ctx, config.GetServerPort())
	if err != nil {
		log.Errorf("Failed to start services: %s", err)
	}
}

func (a App) CurrentProject() (*Project, error) {
	if a.currentProject == nil {
		return nil, fmt.Errorf("no current project")
	}
	return a.currentProject, nil
}

func (a App) RecentProjects() []string {
	return config.GetRecentEntries()
}

func (a *App) OpenProject() (*Project, error) {
	opts := runtime.OpenDialogOptions{
		Title: "Open Project",
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		return nil, err
	}
	p, err := readProject(dir)
	if err != nil {
		return nil, err
	}
	a.currentProject = p
	config.AppendRecentEntry(dir)
	return p, nil
}

// OpenRecentProject opens a project with the given source
func (a *App) OpenRecentProject(source string) (*Project, error) {
	log.Infof("Open Recent Project %s", source)
	p, err := readProject(source)
	if err != nil {
		return nil, err
	}
	a.currentProject = p
	config.AppendRecentEntry(source)
	return p, nil
}

// CreateProject creates a new project in the given source
func (a *App) CreateProject() (*Project, error) {
	opts := runtime.OpenDialogOptions{
		Title:                "Open Folder",
		CanCreateDirectories: true,
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		return nil, err
	}
	p, err := readProject(dir)
	if err != nil {
		return nil, err
	}
	a.currentProject = p
	config.AppendRecentEntry(dir)
	return p, nil
}

// ImportProject imports a project from a local or remote source
func (a *App) ImportProject(source string) Project {
	log.Infof("Import Project %s", source)
	return Project{}
}

// ShareProject returns a shareable link for the given project
func (a *App) ShareProject(project Project) string {
	log.Infof("Share Project %s", project.Path)
	return "https://example.com"
}

// InstallTemplate installs a template either from local or remote source
func (a *App) InstallTemplate(source string) {
	log.Infof("Install Template %s", source)
}

func readProject(source string) (*Project, error) {
	p := &Project{
		Path: source,
		Name: filepath.Base(source),
	}
	entries, err := os.ReadDir(filepath.Join(source, "apigear"))
	if err != nil {
		return nil, err
	}
	var docs []DocumentInfo
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		docs = append(docs, DocumentInfo{
			Name: entry.Name(),
			Path: filepath.Join(source, "apigear", entry.Name()),
			Type: guessDocumentType(entry.Name()),
		})
	}
	p.Documents = docs
	return p, nil
}

func (a App) DocumentsByType(docType string) []DocumentInfo {
	var docs []DocumentInfo
	for _, doc := range a.currentProject.Documents {
		if doc.Type == docType {
			docs = append(docs, doc)
		}
	}
	return docs
}

func guessDocumentType(path string) string {
	if strings.HasSuffix(path, ".module.yaml") {
		return "module"
	}
	if strings.HasSuffix(path, ".solution.yaml") {
		return "solution"
	}
	if strings.HasSuffix(path, ".scenario.yaml") {
		return "scenario"
	}
	return "unknown"
}

func (a App) ReadSettings() AppSettings {
	server_port := config.GetServerPort()
	update_channel := config.GetUpdateChannel()
	editor_command := config.GetEditorCommand()
	return AppSettings{
		ServerPort:    server_port,
		UpdateChannel: update_channel,
		EditorCommand: editor_command,
	}
}

func (a App) WriteSettings(settings AppSettings) {
	log.Infof("Write Settings %+v", settings)
	config.Set(config.KeyServerPort, settings.ServerPort)
	config.Set(config.KeyUpdateChannel, settings.UpdateChannel)
	config.Set(config.KeyEditorCommand, settings.EditorCommand)
	config.WriteConfig()

}

func (a App) NewDocument(name string, docType string) {
	log.Infof("New Document %s %s", name, docType)
}

func (a App) GetMonitorAddress() (string, error) {
	return GetMonitorAddress()
}

func (a App) GetSimulationAddress() (string, error) {
	return GetSimulationAddress()
}
