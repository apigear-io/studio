# ApiGear Studio Specification

## Page Actions

On all pages the product logo and version is displayed.

Actions:

x Version information: displays update dialog

When current project is set the project name is displayed and the following actions are available:

Actions:

- New solution document: opens new document dialog and creates new solution document
- New module document: opens new document dialog and creates new module document
- New simulation document: opens new document dialog and creates new simulation document
- Switch project: opens dashboard page with all projects
- Sync project: re-reads current project from disk
- Copy project path: copies current project path to clipboard
- Open help: opens product help in browser


## Welcome Page

The welcome page is the first page the user sees. 
It shows to get started with the product and where to find more information

Actions: 
- Create project - opens project creation dialog and creates new project with demo content
- Open project - opens project selection dialog and opens existing project
- Import project - opens project import dialog and imports existing project from a git url
- Open recent project - opens recent project from list of recent projects
- Remove recent project - removes recent project from list of recent projects
- Open product landing page - opens product landing page in the browser
- Open product tutorials - opens product tutorials in the browser
- Open product documentation - opens product documentation in the browser


## Dashboard Page

The dashboard page shows the documents from the current project.

Actions:

- Open in editor - opens selected document in editor
- Open in specialized view - opens selected document in specialized view


## Modules Page

The modules page shows the API modules from the current project.

Actions:
- Open in editor - opens selected document in editor
- Copy path - copies path of selected document to clipboard


## Solutions Page

The solutions page shows the API solutions from the current project. Running the solution will generate the configured SDK. A report is generated when the solution is run.

Actions:

- Open in editor - opens selected document in editor
- Copy path - copies path of selected document to clipboard
x Run solution - runs selected solution and displays report
x Toggle auto-run - toggles auto-run of selected solution, which runs the solution when a document changes

## Templates Page

The templates page shows the API templates from the current project. It allows the installation and update of templates.

Actions:

- Import template: opens template import dialog and imports template from a git url
- Refresh list: refreshes the list of templates
- Update template: opens template update dialog and updates template to a specific version
- Remove template: removes selected template fro local storage 
- Copy name: copies name of selected template to clipboard

## Simulation Page

The simulation page shows the API simulations from the current project. A simulation can be toggled and the simulation status can be displayed.

Actions:
- Open in editor - opens selected document in editor
- Copy path - copies path of selected document to clipboard
x Toggle simulation - toggles selected simulation
x Display simulation status - displays status of selected simulations


## Monitor Page

The monitor page shows the API events. The events can be filtered and searched.

Actions:
- Filter: filters events by service, type
- Toggle Scroll: toggles scrolling of events
- Clear : clears all events
- Search: searches events by service, type, message

## Logs Page

The logs page shows the application logs. The logs can be filtered and searched.

Action:
- Log level: Select log level to be displayed
- Search: searches logs by topic and message

## Settings Page

The settings page shows the application wide settings.

Edit application wide settings and apply results. Changes are applied immediately. Changing the server port also changes the monitor address and simulation address.

Actions:
- server port: edit the server port
- update channel: edit the update channel
- editor command: edit the editor command


