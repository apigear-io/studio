// Cynhyrchwyd y ffeil hon yn awtomatig. PEIDIWCH Â MODIWL
// This file is automatically generated. DO NOT EDIT
import {main} from '../models';

export function CheckDocument(arg1:string):Promise<any>;

export function CheckUpdate():Promise<any>;

export function CreateProject():Promise<any>;

export function EmitProjectChanged():Promise<void>;

export function GetCacheList():Promise<Array<main.RepoInfo>>;

export function GetMonitorAddress():Promise<string>;

export function GetRegistryList():Promise<Array<main.RepoInfo>>;

export function GetSimulationAddress():Promise<string>;

export function ImportProject(arg1:string,arg2:string):Promise<any>;

export function InstallTemplate(arg1:string,arg2:string):Promise<void>;

export function InstallTemplateFromSource(arg1:string):Promise<any>;

export function NewDocument(arg1:string,arg2:string):Promise<string>;

export function OpenProject():Promise<any>;

export function OpenRecentProject(arg1:string):Promise<any>;

export function OpenSourceInEditor(arg1:string):Promise<void>;

export function ReadSettings():Promise<main.AppSettings>;

export function RecentProjects():Promise<Array<string>>;

export function RefreshCurrentProject():Promise<any>;

export function RemoveRecentProject(arg1:string):Promise<void>;

export function RemoveTemplate(arg1:string):Promise<void>;

export function RestartApp():Promise<void>;

export function RunSolution(arg1:string):Promise<void>;

export function SelectDirectory():Promise<string>;

export function ShareProject(arg1:main.ProjectInfo):Promise<string>;

export function StartScenario(arg1:string):Promise<void>;

export function StopScenario(arg1:string):Promise<void>;

export function UpdateProgram(arg1:string):Promise<void>;

export function UpdateTemplateRegistry():Promise<void>;

export function VersionInfo():Promise<any>;

export function WatchSolution(arg1:string,arg2:boolean):Promise<Array<string>>;

export function WriteSettings(arg1:main.AppSettings):Promise<void>;
