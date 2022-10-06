package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/apigear-io/cli/pkg/config"
	"github.com/apigear-io/cli/pkg/helper"
	"github.com/apigear-io/cli/pkg/prj"
	"github.com/apigear-io/cli/pkg/sim/actions"
	"github.com/apigear-io/cli/pkg/sol"
	"github.com/apigear-io/cli/pkg/spec"
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
		log.Error().Msgf("Failed to start services: %s", err)
	}
}

func (a *App) shutdown(ctx context.Context) {
	log.Info().Msg("shutdown")
	StopServices()
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
	log.Info().Msgf("open recent project %s", dir)
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
	log.Info().Msgf("Import project to %s from %s", targetDir, repoUrl)
	proj, err := prj.ImportProject(repoUrl, targetDir)
	if err != nil {
		return nil, fmt.Errorf("failed to import project: %s", err)
	}
	return a.openProject(proj.Path)
}

// ShareProject returns a shareable link for the given project
func (a *App) ShareProject(project ProjectInfo) string {
	log.Info().Msgf("Share Project %s", project.Path)
	return "https://example.com"
}

// InstallTemplate installs a template either from local or remote source
func (a *App) InstallTemplate(source string) {
	log.Info().Msgf("Install Template %s", source)
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
	log.Info().Msgf("Write Settings %+v", settings)
	config.Set(config.KeyServerPort, settings.ServerPort)
	config.Set(config.KeyUpdateChannel, settings.UpdateChannel)
	config.Set(config.KeyEditorCommand, settings.EditorCommand)
	config.WriteConfig()

}

// NewDocument creates a new document in the current project
func (a App) NewDocument(docType string, name string) (string, error) {
	log.Info().Msgf("New Document %s %s", name, docType)
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
	log.Info().Msgf("Open Project In Editor %s", source)
	return prj.OpenEditor(source)
}

func (a *App) RefreshCurrentProject() (*ProjectInfo, error) {
	if a.currentProject == nil {
		return nil, nil
	}
	return a.openProject(a.currentProject.Path)
}

func (a *App) openProject(dir string) (*ProjectInfo, error) {
	// close all runners
	r := GetRunner()
	if r != nil {
		r.Clear()
	}
	// check if dir exists
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		a.currentProject = nil
		return nil, fmt.Errorf("project directory does not exist: %s", dir)
	}
	p, err := doReadProject(dir)
	if err != nil {
		a.currentProject = nil
		return nil, fmt.Errorf("failed to read project: %w", err)
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
	entries, err := os.ReadDir(helper.Join(source, "apigear"))
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
			Path: helper.Join(source, "apigear", entry.Name()),
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
			Source: tpl.Git,
			Path:   tpl.Path,
		}
	}
	fmt.Println(len(out))
	return out, nil
}

func (a App) InstallTemplateFromSource(source string) (*TemplateInfo, error) {
	log.Info().Msgf("Install Template From Source %s", source)
	vcs, err := tpl.ImportTemplate(source)
	if err != nil {
		return nil, err
	}
	return &TemplateInfo{
		Name:   vcs.FullName,
		Source: source,
	}, nil
}

func (a App) RemoveTemplate(name string) error {
	log.Info().Msgf("Remove Template %s", name)
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
	log.Info().Msgf("run solution %s", source)
	doc, err := sol.ReadSolutionDoc(source)
	if err != nil {
		return err
	}
	r := GetRunner()
	err = r.RunDoc(source, doc)
	if err != nil {
		return err
	}
	return nil
}

func (a App) WatchSolution(source string, enabled bool) ([]string, error) {
	log.Info().Msgf("watch solution %s: enabled: %t", source, enabled)
	r := GetRunner()
	if enabled {
		doc, err := sol.ReadSolutionDoc(source)
		if err != nil {
			return nil, err
		}
		_, err = r.StartWatch(source, doc)
		if err != nil {
			log.Warn().Msgf("watch solution %s failed: %s", source, err)
		}
	} else {
		r.StopWatch(source)
	}
	return r.TaskFiles(), nil
}

func (a App) RestartApp() {
	log.Info().Msgf("Restart App")
	err := RestartSelf()
	if err != nil {
		log.Error().Msgf("Failed to restart app: %s", err)
	}
}

func (a App) StartScenario(source string) error {
	log.Debug().Msgf("start scenario %s", source)
	s := GetSimulation()
	result, err := spec.CheckFile(source)
	if err != nil {
		return err
	}
	if !result.Valid() {
		var entries []string
		for _, err := range result.Errors() {
			entries = append(entries, err.String())
		}
		return fmt.Errorf("scenario file is invalid: %s", strings.Join(entries, " / "))
	}

	doc, err := actions.ReadScenario(source)
	if err != nil {
		return err
	}
	err = s.LoadScenario(source, doc)
	if err != nil {
		return err
	}
	return nil
}

func (a App) StopScenario(source string) error {
	log.Debug().Msgf("stop scenario %s", source)
	s := GetSimulation()
	return s.UnloadScenario(source)
}

func (a App) CheckUpdate() (*ReleaseInfo, error) {
	log.Debug().Msgf("check update")
	return CheckAppUpdate()
}

func (a App) UpdateProgram(version string) error {
	log.Debug().Msgf("update program")
	return UpdateApp(version)
}
