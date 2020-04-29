/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { NgModule, LOCALE_ID } from '@angular/core';
import { ScriptLoaderService } from './script-loader/script-loader.service';
import { RawChartComponent } from './raw-chart/raw-chart.component';
import { GoogleChartComponent } from './google-chart/google-chart.component';
import { GOOGLE_API_KEY, CHART_VERSION } from './models/injection-tokens.model';
/** @type {?} */
export const GOOGLE_CHARTS_PROVIDERS = [
    {
        provide: ScriptLoaderService,
        useFactory: setupScriptLoaderService,
        deps: [LOCALE_ID, GOOGLE_API_KEY, CHART_VERSION]
    }
];
export class GoogleChartsModule {
    /**
     * @param {?=} googleApiKey
     * @param {?=} chartVersion
     * @return {?}
     */
    static forRoot(googleApiKey, chartVersion) {
        return {
            ngModule: GoogleChartsModule,
            providers: [
                GOOGLE_CHARTS_PROVIDERS,
                { provide: GOOGLE_API_KEY, useValue: googleApiKey ? googleApiKey : '' },
                { provide: CHART_VERSION, useValue: chartVersion ? chartVersion : '46' }
            ]
        };
    }
}
GoogleChartsModule.decorators = [
    { type: NgModule, args: [{
                providers: [ScriptLoaderService],
                declarations: [GoogleChartComponent, RawChartComponent],
                exports: [GoogleChartComponent, RawChartComponent]
            },] }
];
/**
 * @param {?} localeId
 * @param {?} googleApiKey
 * @param {?} chartVersion
 * @return {?}
 */
export function setupScriptLoaderService(localeId, googleApiKey, chartVersion) {
    return new ScriptLoaderService(localeId, googleApiKey, chartVersion);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0cy5tb2R1bGUuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyLWdvb2dsZS1jaGFydHMvIiwic291cmNlcyI6WyJsaWIvZ29vZ2xlLWNoYXJ0cy5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQVksU0FBUyxFQUF1QixNQUFNLGVBQWUsQ0FBQztBQUVuRixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUNwRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx1Q0FBdUMsQ0FBQztBQUM3RSxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlDQUFpQyxDQUFDOztBQUVoRixNQUFNLE9BQU8sdUJBQXVCLEdBQWU7SUFDakQ7UUFDRSxPQUFPLEVBQUUsbUJBQW1CO1FBQzVCLFVBQVUsRUFBRSx3QkFBd0I7UUFDcEMsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFLGNBQWMsRUFBRSxhQUFhLENBQUM7S0FDakQ7Q0FDRjtBQU9ELE1BQU0sT0FBTyxrQkFBa0I7Ozs7OztJQUN0QixNQUFNLENBQUMsT0FBTyxDQUFDLFlBQXFCLEVBQUUsWUFBcUI7UUFDaEUsT0FBTztZQUNMLFFBQVEsRUFBRSxrQkFBa0I7WUFDNUIsU0FBUyxFQUFFO2dCQUNULHVCQUF1QjtnQkFDdkIsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN2RSxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUU7YUFDekU7U0FDRixDQUFDO0lBQ0osQ0FBQzs7O1lBZkYsUUFBUSxTQUFDO2dCQUNSLFNBQVMsRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUNoQyxZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxpQkFBaUIsQ0FBQztnQkFDdkQsT0FBTyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsaUJBQWlCLENBQUM7YUFDbkQ7Ozs7Ozs7O0FBY0QsTUFBTSxVQUFVLHdCQUF3QixDQUFDLFFBQWdCLEVBQUUsWUFBb0IsRUFBRSxZQUFvQjtJQUNuRyxPQUFPLElBQUksbUJBQW1CLENBQUMsUUFBUSxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsQ0FBQztBQUN2RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIFByb3ZpZGVyLCBMT0NBTEVfSUQsIE1vZHVsZVdpdGhQcm92aWRlcnMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IFNjcmlwdExvYWRlclNlcnZpY2UgfSBmcm9tICcuL3NjcmlwdC1sb2FkZXIvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmF3Q2hhcnRDb21wb25lbnQgfSBmcm9tICcuL3Jhdy1jaGFydC9yYXctY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgR29vZ2xlQ2hhcnRDb21wb25lbnQgfSBmcm9tICcuL2dvb2dsZS1jaGFydC9nb29nbGUtY2hhcnQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgR09PR0xFX0FQSV9LRVksIENIQVJUX1ZFUlNJT04gfSBmcm9tICcuL21vZGVscy9pbmplY3Rpb24tdG9rZW5zLm1vZGVsJztcclxuXHJcbmV4cG9ydCBjb25zdCBHT09HTEVfQ0hBUlRTX1BST1ZJREVSUzogUHJvdmlkZXJbXSA9IFtcclxuICB7XHJcbiAgICBwcm92aWRlOiBTY3JpcHRMb2FkZXJTZXJ2aWNlLFxyXG4gICAgdXNlRmFjdG9yeTogc2V0dXBTY3JpcHRMb2FkZXJTZXJ2aWNlLFxyXG4gICAgZGVwczogW0xPQ0FMRV9JRCwgR09PR0xFX0FQSV9LRVksIENIQVJUX1ZFUlNJT05dXHJcbiAgfVxyXG5dO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBwcm92aWRlcnM6IFtTY3JpcHRMb2FkZXJTZXJ2aWNlXSxcclxuICBkZWNsYXJhdGlvbnM6IFtHb29nbGVDaGFydENvbXBvbmVudCwgUmF3Q2hhcnRDb21wb25lbnRdLFxyXG4gIGV4cG9ydHM6IFtHb29nbGVDaGFydENvbXBvbmVudCwgUmF3Q2hhcnRDb21wb25lbnRdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHb29nbGVDaGFydHNNb2R1bGUge1xyXG4gIHB1YmxpYyBzdGF0aWMgZm9yUm9vdChnb29nbGVBcGlLZXk/OiBzdHJpbmcsIGNoYXJ0VmVyc2lvbj86IHN0cmluZyk6IE1vZHVsZVdpdGhQcm92aWRlcnMge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEdvb2dsZUNoYXJ0c01vZHVsZSxcclxuICAgICAgcHJvdmlkZXJzOiBbXHJcbiAgICAgICAgR09PR0xFX0NIQVJUU19QUk9WSURFUlMsXHJcbiAgICAgICAgeyBwcm92aWRlOiBHT09HTEVfQVBJX0tFWSwgdXNlVmFsdWU6IGdvb2dsZUFwaUtleSA/IGdvb2dsZUFwaUtleSA6ICcnIH0sXHJcbiAgICAgICAgeyBwcm92aWRlOiBDSEFSVF9WRVJTSU9OLCB1c2VWYWx1ZTogY2hhcnRWZXJzaW9uID8gY2hhcnRWZXJzaW9uIDogJzQ2JyB9XHJcbiAgICAgIF1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXBTY3JpcHRMb2FkZXJTZXJ2aWNlKGxvY2FsZUlkOiBzdHJpbmcsIGdvb2dsZUFwaUtleTogc3RyaW5nLCBjaGFydFZlcnNpb246IHN0cmluZyk6IFNjcmlwdExvYWRlclNlcnZpY2Uge1xyXG4gIHJldHVybiBuZXcgU2NyaXB0TG9hZGVyU2VydmljZShsb2NhbGVJZCwgZ29vZ2xlQXBpS2V5LCBjaGFydFZlcnNpb24pO1xyXG59XHJcbiJdfQ==