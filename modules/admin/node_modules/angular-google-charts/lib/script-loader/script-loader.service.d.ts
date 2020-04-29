import { Observable } from 'rxjs';
export declare class ScriptLoaderService {
    private localeId;
    private googleApiKey?;
    private chartVersion?;
    private readonly scriptSource;
    private onLoadSubject;
    constructor(localeId: string, googleApiKey?: string, chartVersion?: string);
    readonly onReady: Observable<boolean>;
    readonly doneLoading: boolean;
    private readonly isLoading;
    loadChartPackages(packages: Array<string>): Observable<void>;
    private initialize;
    private createScriptElement;
}
