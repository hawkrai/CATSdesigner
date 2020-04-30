import { Provider, ModuleWithProviders } from '@angular/core';
import { ScriptLoaderService } from './script-loader/script-loader.service';
export declare const GOOGLE_CHARTS_PROVIDERS: Provider[];
export declare class GoogleChartsModule {
    static forRoot(googleApiKey?: string, chartVersion?: string): ModuleWithProviders;
}
export declare function setupScriptLoaderService(localeId: string, googleApiKey: string, chartVersion: string): ScriptLoaderService;
