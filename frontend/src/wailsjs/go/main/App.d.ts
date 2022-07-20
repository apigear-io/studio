// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';

export function GetTemplates():Promise<Array<main.TemplateInfo>|Error>;

export function OpenRecentProject(arg1:string):Promise<main.ProjectInfo|Error>;

export function RemoveTemplate(arg1:string):Promise<Error>;

export function GetMonitorAddress():Promise<string|Error>;

export function NewDocument(arg1:string,arg2:string):Promise<string|Error>;

export function OpenProject():Promise<main.ProjectInfo|Error>;

export function WriteSettings(arg1:main.AppSettings):void;

export function GetSimulationAddress():Promise<string|Error>;

export function InstallTemplate(arg1:string):void;

export function RecentProjects():Promise<Array<string>>;

export function RemoveRecentProject(arg1:string):void;

export function CreateProject():Promise<main.ProjectInfo|Error>;

export function EmitProjectChanged():void;

export function ImportProject(arg1:string):Promise<main.ProjectInfo>;

export function InstallTemplateFromSource(arg1:string):Promise<main.TemplateInfo|Error>;

export function OpenSourceInEditor(arg1:string):Promise<Error>;

export function ReadSettings():Promise<main.AppSettings>;

export function RefreshCurrentProject():Promise<main.ProjectInfo|Error>;

export function ShareProject(arg1:main.ProjectInfo):Promise<string>;
