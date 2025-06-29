package main

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"runtime/debug"

	"github.com/apigear-io/cli/pkg/cfg"
	"github.com/apigear-io/cli/pkg/helper"
	"github.com/apigear-io/cli/pkg/net"
	"github.com/apigear-io/cli/pkg/prj"
	"github.com/apigear-io/cli/pkg/repos"
	"github.com/apigear-io/cli/pkg/sim"
	"github.com/apigear-io/cli/pkg/sol"
	"github.com/apigear-io/cli/pkg/spec"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx            context.Context
	currentProject *ProjectInfo
	netman         *net.NetworkManager
	simman         *sim.Manager
}

// NewApp creates a new App application struct
func NewApp() *App {
	netman := net.NewManager()
	siman := sim.NewManager(sim.ManagerOptions{})
	return &App{
		ctx:    context.Background(),
		netman: netman,
		simman: siman,
	}
}

func (a *App) NetworkManager() *net.NetworkManager {
	return a.netman
}

func (a *App) SimulationManager() *sim.Manager {
	return a.simman
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	w := cfg.GetInt(cfg.KeyWindowWidth)
	h := cfg.GetInt(cfg.KeyWindowHeight)
	runtime.WindowSetSize(ctx, w, h)
	err := StartServices(a)
	if err != nil {
		log.Error().Err(err).Msgf("start services: %s", err)
	}
}

func (a *App) shutdown(ctx context.Context) {
	log.Info().Msg("shutdown")
	StopServices(a)
	w, h := runtime.WindowGetSize(ctx)
	cfg.Set(cfg.KeyWindowWidth, w)
	cfg.Set(cfg.KeyWindowHeight, h)
	cfg.WriteConfig()
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
func (a *App) InstallTemplate(name string, version string) error {
	log.Info().Msgf("Install Template %s", name)
	repoID := repos.MakeRepoID(name, version)
	fixedRepoId, err := repos.GetOrInstallTemplateFromRepoID(repoID)
	if err != nil {
		log.Error().Err(err).Msgf("install template: %s", fixedRepoId)
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
	target, err := prj.AddDocument(dir, docType, name)
	a.openProject(dir)
	if err != nil {
		log.Error().Err(err).Msgf("create document: %s", err)
		return "", err
	}
	return target, err
}

func (a App) GetMonitorAddress() (string, error) {
	return a.NetworkManager().GetMonitorAddress()
}

func (a App) GetSimulationAddress() (string, error) {
	return a.NetworkManager().GetSimulationAddress()
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
			Type: helper.GetDocumentType(entry.Name()),
		})
	}
	p.Documents = docs
	return p, nil
}

func (a App) EmitProjectChanged() {
	runtime.EventsEmit(a.ctx, "ProjectChanged", a.currentProject)
}

func (a App) GetCacheList() ([]RepoInfo, error) {
	in, err := repos.Cache.List()
	if err != nil {
		log.Error().Err(err).Msgf("get templates: %s", err)
		return nil, err
	}
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

func (a App) GetRegistryList() ([]RepoInfo, error) {
	in, err := repos.Registry.List()
	if err != nil {
		log.Error().Err(err).Msgf("get templates: %s", err)
		return nil, err
	}
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
	return repos.Registry.Update()
}

func (a App) InstallTemplateFromSource(source string) (*RepoInfo, error) {
	log.Info().Msgf("Install Template From Source %s", source)
	fqn, err := repos.Cache.Install(source, "")
	if err != nil {
		log.Error().Err(err).Msgf("install template from source %s", source)
		return nil, err
	}
	return &RepoInfo{
		Name:   fqn,
		Source: source,
	}, nil
}

func (a App) RemoveTemplate(fqn string) error {
	log.Info().Msgf("Remove Template %s", fqn)
	err := repos.Cache.Remove(fqn)
	if err != nil {
		log.Error().Err(err).Msgf("remove template %s", fqn)
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
	ctx := context.Background()
	doc, err := sol.ReadSolutionDoc(source)
	if err != nil {
		log.Error().Err(err).Msgf("read document %s", helper.BaseName(source))
		return err
	}
	r := GetRunner()
	err = r.RunDoc(ctx, source, doc)
	if err != nil {
		log.Error().Err(err).Msg("run solution")
		return err
	}
	return nil
}

func (a App) WatchSolution(source string, enabled bool) ([]string, error) {
	log.Info().Msgf("watch solution %s: enabled: %t", source, enabled)
	r := GetRunner()
	ctx := context.Background()
	r.StopWatch(source)
	if enabled {
		doc, err := sol.ReadSolutionDoc(source)
		if err != nil {
			log.Error().Msgf("watch solution: %s", err)
			return nil, err
		}
		err = r.WatchDoc(ctx, source, doc)
		if err != nil {
			log.Error().Msgf("watch solution: %s", err)
		}
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

func (a App) StartSimulation(source string) error {
	log.Debug().Msgf("start client simulation %s", source)
	content, err := os.ReadFile(source)
	if err != nil {
		return err
	}
	simman := a.SimulationManager()
	simman.ScriptRun(sim.NewScript(source, string(content)))
	simman.FunctionRun("main", nil)
	return nil
}

func (a App) StopSimulation(source string) error {
	log.Debug().Msgf("stop client simulation %s", source)
	err := a.SimulationManager().ScriptStop(source)
	if err != nil {
		log.Error().Err(err).Msgf("stop simulation: %s", err)
	} else {
		log.Info().Msgf("simulation stopped")
	}
	return err
}

func (a App) VersionInfo() *BuildInfo {
	var info = cfg.GetBuildInfo("studio")
	return &BuildInfo{Version: info.Version, Commit: info.Commit, Date: info.Date}
}

func (a App) CliVersionInfo() (*BuildInfo, error) {
	bi, ok := debug.ReadBuildInfo()
	if !ok {
		return nil, fmt.Errorf("no build info")
	}

	var cli_version = "v0.0.0"
	for _, dep := range bi.Deps {
		if dep.Path == "github.com/apigear-io/cli" {
			cli_version = dep.Version
			break
		}
	}
	return &BuildInfo{
		Version: cli_version,
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
	ctx := context.Background()
	err := UpdateApp(ctx, version)
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
	for _, err := range result.Errors {
		errors = append(errors, err.String())
	}
	return &CheckResult{
		IsValid: result.Valid(),
		Errors:  errors,
	}, nil
}
