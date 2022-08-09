package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/apigear-io/cli/pkg/config"
	"github.com/apigear-io/cli/pkg/git"
	"github.com/apigear-io/cli/pkg/prj"
	"github.com/apigear-io/cli/pkg/sol"
	"github.com/apigear-io/cli/pkg/tpl"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	currentProject *ProjectInfo
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

func (a App) RecentProjects() []string {
	return config.GetRecentEntries()
}

func (a *App) OpenProject() (*ProjectInfo, error) {
	opts := runtime.OpenDialogOptions{
		Title: "Open Project",
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		return nil, err
	}
	_, err = a.openProject(dir)
	if err != nil {
		return nil, err
	}
	return a.currentProject, nil
}

// OpenRecentProject opens a project with the given source
func (a *App) OpenRecentProject(dir string) (*ProjectInfo, error) {
	log.Infof("open recent project %s", dir)
	project, err := a.openProject(dir)
	if err != nil {
		return nil, err
	}
	return project, nil
}

// CreateProject creates a new project in the given source
func (a *App) CreateProject() (*ProjectInfo, error) {
	opts := runtime.OpenDialogOptions{
		Title:                "Open Folder",
		CanCreateDirectories: true,
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		return nil, err
	}
	prj.InitProject(dir)
	proj, err := a.openProject(dir)
	if err != nil {
		return nil, err
	}
	return proj, nil
}

// ImportProject imports a project from a local or remote source
func (a *App) ImportProject(repoUrl string, targetDir string) (*ProjectInfo, error) {
	log.Infof("Import project to %s from %s", targetDir, repoUrl)
	proj, err := prj.ImportProject(repoUrl, targetDir)
	if err != nil {
		return nil, fmt.Errorf("failed to import project: %s", err)
	}
	return a.openProject(proj.Path)
}

// ShareProject returns a shareable link for the given project
func (a *App) ShareProject(project ProjectInfo) string {
	log.Infof("Share Project %s", project.Path)
	return "https://example.com"
}

// InstallTemplate installs a template either from local or remote source
func (a *App) InstallTemplate(source string) {
	log.Infof("Install Template %s", source)
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

// NewDocument creates a new document in the current project
func (a App) NewDocument(docType string, name string) (string, error) {
	log.Infof("New Document %s %s", name, docType)
	if a.currentProject == nil {
		return "", fmt.Errorf("no project open")
	}
	dir := a.currentProject.Path
	target, err := prj.CreateProjectDocument(dir, docType, name)
	a.openProject(dir)
	return target, err
}

func (a App) GetMonitorAddress() (string, error) {
	return GetMonitorAddress()
}

func (a App) GetSimulationAddress() (string, error) {
	return GetSimulationAddress()
}

func (a App) RemoveRecentProject(source string) {
	config.RemoveRecentEntry(source)
}
func (a App) OpenSourceInEditor(source string) error {
	log.Infof("Open Project In Editor %s", source)
	return prj.OpenEditor(source)
}

func (a *App) RefreshCurrentProject() (*ProjectInfo, error) {
	if a.currentProject == nil {
		return nil, nil
	}
	return a.openProject(a.currentProject.Path)
}

func (a *App) openProject(dir string) (*ProjectInfo, error) {
	// check if dir exists
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		a.currentProject = nil
		return nil, fmt.Errorf("project directory does not exist: %s", dir)
	}
	p, err := doReadProject(dir)
	if err != nil {
		a.currentProject = nil
		return nil, fmt.Errorf("Failed to read project: %s", err)
	}
	a.currentProject = p
	config.AppendRecentEntry(p.Path)
	return p, err
}

func doReadProject(source string) (*ProjectInfo, error) {
	p := &ProjectInfo{
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

func (a App) EmitProjectChanged() {
	runtime.EventsEmit(a.ctx, "ProjectChanged", a.currentProject)
}

func (a App) GetTemplates() ([]TemplateInfo, error) {
	in, err := tpl.ListTemplates()
	if err != nil {
		return nil, err
	}
	fmt.Println(len(in))
	out := make([]TemplateInfo, len(in))
	for i, tpl := range in {
		out[i] = TemplateInfo{
			Name:   tpl.Name,
			Source: tpl.URL,
			Path:   tpl.Path,
		}
	}
	fmt.Println(len(out))
	return out, nil
}

func (a App) InstallTemplateFromSource(source string) (*TemplateInfo, error) {
	log.Infof("Install Template From Source %s", source)
	name, err := git.RepositoryNameFromGitUrl(source)
	if err != nil {
		return nil, err
	}
	err = tpl.InstallTemplate(name, source)
	if err != nil {
		return nil, err
	}
	return &TemplateInfo{
		Name:   name,
		Source: source,
	}, nil
}

func (a App) RemoveTemplate(name string) error {
	log.Infof("Remove Template %s", name)
	return tpl.RemoveTemplate(name)
}

func (a App) SelectDirectory() (string, error) {
	opts := runtime.OpenDialogOptions{
		Title:                "Open Folder",
		CanCreateDirectories: true,
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		return "", err
	}
	return dir, nil
}

func (a App) RunSolution(source string) error {
	log.Infof("run solution %s", source)
	_, err := sol.RunSolutionFile(source)
	if err != nil {
		return err
	}
	return nil
}

func (a App) RestartApp() {
	log.Infof("Restart App")
	err := RestartSelf()
	if err != nil {
		log.Errorf("Failed to restart app: %s", err)
	}
}
