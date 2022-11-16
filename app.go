package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/apigear-io/cli/pkg/cfg"
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
	err := StartServices(ctx, cfg.ServerPort())
	if err != nil {
		log.Error().Msgf("start services: %s", err)
	}
}

func (a *App) shutdown(ctx context.Context) {
	log.Info().Msg("shutdown")
	StopServices()
}

func (a App) RecentProjects() []string {
	return cfg.RecentEntries()
}

func (a *App) OpenProject() (*ProjectInfo, error) {
	log.Info().Msg("Open Project")
	opts := runtime.OpenDialogOptions{
		Title: "Open Project",
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		log.Error().Err(err).Msgf("open project: %s", err)
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
		log.Error().Err(err).Msgf("open recent: %s", err)
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
		log.Error().Err(err).Msgf("open project: %s", err)
		return nil, err
	}
	prj.InitProject(dir)
	proj, err := a.openProject(dir)
	if err != nil {
		log.Error().Err(err).Msgf("open project: %s", err)
		return nil, err
	}
	return proj, nil
}

// ImportProject imports a project from a local or remote source
func (a *App) ImportProject(repoUrl string, targetDir string) (*ProjectInfo, error) {
	log.Info().Msgf("Import project to %s from %s", targetDir, repoUrl)
	proj, err := prj.ImportProject(repoUrl, targetDir)
	if err != nil {
		log.Error().Err(err).Msgf("import project: %s", err)
		return nil, fmt.Errorf("import project: %s", err)
	}
	return a.openProject(proj.Path)
}

// ShareProject returns a shareable link for the given project
func (a *App) ShareProject(project ProjectInfo) string {
	log.Info().Msgf("Share Project %s", project.Path)
	return "https://example.com"
}

// InstallTemplate installs a template either from local or remote source
func (a *App) InstallTemplate(name string) error {
	log.Info().Msgf("Install Template %s", name)
	err := tpl.InstallTemplate(name)
	if err != nil {
		log.Error().Err(err).Msgf("install template: %s", err)
	}
	return err
}

func (a App) ReadSettings() AppSettings {
	server_port := cfg.ServerPort()
	update_channel := cfg.UpdateChannel()
	editor_command := cfg.EditorCommand()
	return AppSettings{
		ServerPort:    server_port,
		UpdateChannel: update_channel,
		EditorCommand: editor_command,
	}
}

func (a App) WriteSettings(settings AppSettings) {
	log.Info().Msgf("Write Settings %+v", settings)
	cfg.Set(cfg.KeyServerPort, settings.ServerPort)
	cfg.Set(cfg.KeyUpdateChannel, settings.UpdateChannel)
	cfg.Set(cfg.KeyEditorCommand, settings.EditorCommand)
	cfg.WriteConfig()

}

// NewDocument creates a new document in the current project
func (a App) NewDocument(docType string, name string) (string, error) {
	log.Info().Msgf("New Document %s %s", name, docType)
	if a.currentProject == nil {
		log.Error().Msgf("no open project to add new document")
		return "", fmt.Errorf("no open project to add new document")
	}
	dir := a.currentProject.Path
	target, err := prj.CreateProjectDocument(dir, docType, name)
	a.openProject(dir)
	if err != nil {
		log.Error().Err(err).Msgf("create document: %s", err)
		return "", err
	}
	return target, err
}

func (a App) GetMonitorAddress() (string, error) {
	s, err := GetMonitorAddress()
	if err != nil {
		log.Error().Err(err).Msgf("get monitor address: %s", err)
		return "", err
	}
	return s, err
}

func (a App) GetSimulationAddress() (string, error) {
	s, err := GetSimulationAddress()
	if err != nil {
		log.Error().Err(err).Msgf("get simulation address: %s", err)
		return "", err
	}
	return s, err
}

func (a App) RemoveRecentProject(source string) {
	cfg.RemoveRecentEntry(source)
}
func (a App) OpenSourceInEditor(source string) error {
	log.Info().Msgf("Open Project In Editor %s", source)
	return prj.OpenEditor(source)
}

func (a *App) RefreshCurrentProject() (*ProjectInfo, error) {
	if a.currentProject == nil {
		return nil, nil
	}
	p, err := a.openProject(a.currentProject.Path)
	if err != nil {
		log.Error().Err(err).Msgf("refresh project: %s", err)
		return nil, err
	}
	return p, err
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
		log.Error().Err(err).Msgf("open project: %s", err)
		a.currentProject = nil
		return nil, fmt.Errorf("read project: %w", err)
	}
	a.currentProject = p
	cfg.AppendRecentEntry(p.Path)
	return p, nil
}

func doReadProject(source string) (*ProjectInfo, error) {
	p := &ProjectInfo{
		Path: source,
		Name: filepath.Base(source),
	}
	entries, err := os.ReadDir(helper.Join(source, "apigear"))
	if err != nil {
		log.Error().Err(err).Msgf("read project: %s", err)
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

func (a App) GetTemplates() ([]RepoInfo, error) {
	in, err := tpl.ListTemplates()
	if err != nil {
		log.Error().Err(err).Msgf("get templates: %s", err)
		return nil, err
	}
	fmt.Println(len(in))
	out := make([]RepoInfo, len(in))
	for i, tpl := range in {
		out[i] = RepoInfo{
			Name:        tpl.Name,
			Description: tpl.Description,
			Source:      tpl.Git,
			Path:        tpl.Path,
			Installed:   tpl.InCache,
			Available:   tpl.InRegistry,
			Versions:    tpl.Versions.AsList(),
		}
	}
	return out, nil
}

func (a App) UpdateTemplateRegistry() error {
	return tpl.UpdateRegistry()
}

func (a App) InstallTemplateFromSource(source string) (*RepoInfo, error) {
	log.Info().Msgf("Install Template From Source %s", source)
	vcs, err := tpl.ImportTemplate(source)
	if err != nil {
		log.Error().Err(err).Msgf("install template from source %s", source)
		return nil, err
	}
	return &RepoInfo{
		Name:   vcs.FullName,
		Source: source,
	}, nil
}

func (a App) RemoveTemplate(name string) error {
	log.Info().Msgf("Remove Template %s", name)
	err := tpl.RemoveTemplate(name)
	if err != nil {
		log.Error().Err(err).Msgf("remove template %s", name)
	}
	return err
}

func (a App) SelectDirectory() (string, error) {
	opts := runtime.OpenDialogOptions{
		Title:                "Open Folder",
		CanCreateDirectories: true,
	}
	dir, err := runtime.OpenDirectoryDialog(a.ctx, opts)
	if err != nil {
		log.Error().Err(err).Msg("open directory dialog")
		return "", err
	}
	return dir, nil
}

func (a App) RunSolution(source string) error {
	log.Info().Msgf("run solution %s", source)
	doc, err := sol.ReadSolutionDoc(source)
	if err != nil {
		log.Error().Err(err).Msgf("read: %s", err)
		return err
	}
	r := GetRunner()
	err = r.RunDoc(source, doc)
	if err != nil {
		log.Error().Err(err).Msgf("solution: %s", err)
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
			log.Error().Msgf("watch solution: %s", err)
			return nil, err
		}
		_, err = r.StartWatch(source, doc)
		if err != nil {
			log.Error().Msgf("watch solution: %s", err)
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
		log.Error().Err(err).Msgf("restart app: %s", err)
	}
}

func (a App) StartScenario(source string) error {
	log.Debug().Msgf("start scenario %s", source)
	s := GetSimulation()
	result, err := spec.CheckFile(source)
	if err != nil {
		log.Error().Err(err).Msgf("start scenario: %s", err)
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
		log.Error().Err(err).Msgf("start scenario: %s", err)
		return err
	}
	err = s.LoadScenario(source, doc)
	if err != nil {
		log.Error().Err(err).Msgf("start scenario: %s", err)
		return err
	}
	return nil
}

func (a App) StopScenario(source string) error {
	log.Debug().Msgf("stop scenario %s", source)
	s := GetSimulation()
	err := s.UnloadScenario(source)
	if err != nil {
		log.Error().Err(err).Msgf("stop scenario: %s", err)
	}
	return err
}

func (a App) VersionInfo() (*VersionInfo, error) {
	version := cfg.BuildVersion()
	commit := cfg.BuildCommit()
	date := cfg.BuildDate()
	return &VersionInfo{
		Version: version,
		Commit:  commit,
		Date:    date,
	}, nil
}

// TODO: need to cache results
func (a App) CheckUpdate() (*ReleaseInfo, error) {
	log.Debug().Msgf("check update")
	rel, err := CheckAppUpdate()
	if err != nil {
		log.Error().Err(err).Msgf("check update: %s", err)
		return nil, err
	}
	return rel, nil
}

func (a App) UpdateProgram(version string) error {
	log.Debug().Msgf("update program")
	err := UpdateApp(version)
	if err != nil {
		log.Error().Err(err).Msgf("update program: %s", err)
		return err
	}
	return nil
}

func (a App) CheckDocument(file string) (*CheckResult, error) {
	log.Debug().Msgf("check document %s", file)
	result, err := spec.CheckFile(file)
	if err != nil {
		log.Error().Err(err).Msgf("check document: %s", err)
		return &CheckResult{
			IsValid: false,
			Errors:  []string{err.Error()},
		}, err
	}
	var errors []string
	for _, err := range result.Errors() {
		errors = append(errors, err.String())
	}
	return &CheckResult{
		IsValid: result.Valid(),
		Errors:  errors,
	}, nil
}
