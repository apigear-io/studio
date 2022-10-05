export namespace main {
	
	export class DocumentInfo {
	    name: string;
	    path: string;
	    type: string;
	
	    static createFrom(source: any = {}) {
	        return new DocumentInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.path = source["path"];
	        this.type = source["type"];
	    }
	}
	export class ProjectInfo {
	    path: string;
	    name: string;
	    documents: DocumentInfo[];
	
	    static createFrom(source: any = {}) {
	        return new ProjectInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.path = source["path"];
	        this.name = source["name"];
	        this.documents = this.convertValues(source["documents"], DocumentInfo);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class TemplateInfo {
	    name: string;
	    description: string;
	    source: string;
	    path: string;
	    installed: boolean;
	    available: boolean;
	
	    static createFrom(source: any = {}) {
	        return new TemplateInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.description = source["description"];
	        this.source = source["source"];
	        this.path = source["path"];
	        this.installed = source["installed"];
	        this.available = source["available"];
	    }
	}
	export class AppSettings {
	    server_port: string;
	    update_channel: string;
	    editor_command: string;
	
	    static createFrom(source: any = {}) {
	        return new AppSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.server_port = source["server_port"];
	        this.update_channel = source["update_channel"];
	        this.editor_command = source["editor_command"];
	    }
	}
	export class ReleaseInfo {
	    version: string;
	    // Go type: time.Time
	    published_at: any;
	    release_notes: string;
	    url: string;
	
	    static createFrom(source: any = {}) {
	        return new ReleaseInfo(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.version = source["version"];
	        this.published_at = this.convertValues(source["published_at"], null);
	        this.release_notes = source["release_notes"];
	        this.url = source["url"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

