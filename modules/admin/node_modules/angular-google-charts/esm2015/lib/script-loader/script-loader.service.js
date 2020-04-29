/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject, LOCALE_ID, Optional } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { GOOGLE_API_KEY, CHART_VERSION } from '../models/injection-tokens.model';
export class ScriptLoaderService {
    /**
     * @param {?} localeId
     * @param {?=} googleApiKey
     * @param {?=} chartVersion
     */
    constructor(localeId, googleApiKey, chartVersion) {
        this.localeId = localeId;
        this.googleApiKey = googleApiKey;
        this.chartVersion = chartVersion;
        this.scriptSource = 'https://www.gstatic.com/charts/loader.js';
        this.onLoadSubject = new Subject();
        this.initialize();
    }
    /**
     * @return {?}
     */
    get onReady() {
        if (this.doneLoading) {
            return of(true);
        }
        return this.onLoadSubject.asObservable();
    }
    /**
     * @return {?}
     */
    get doneLoading() {
        if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
            return false;
        }
        return true;
    }
    /**
     * @private
     * @return {?}
     */
    get isLoading() {
        if (this.doneLoading) {
            return false;
        }
        /** @type {?} */
        const pageScripts = Array.from(document.getElementsByTagName('script'));
        /** @type {?} */
        const googleChartsScript = pageScripts.find((/**
         * @param {?} script
         * @return {?}
         */
        script => script.src === this.scriptSource));
        return googleChartsScript !== undefined;
    }
    /**
     * @param {?} packages
     * @return {?}
     */
    loadChartPackages(packages) {
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        observer => {
            /** @type {?} */
            const config = {
                packages: packages,
                language: this.localeId,
                mapsApiKey: this.googleApiKey
            };
            google.charts.load(this.chartVersion, config);
            google.charts.setOnLoadCallback((/**
             * @return {?}
             */
            () => {
                observer.next();
                observer.complete();
            }));
        }));
    }
    /**
     * @private
     * @return {?}
     */
    initialize() {
        if (!this.doneLoading && !this.isLoading) {
            /** @type {?} */
            const script = this.createScriptElement();
            script.onload = (/**
             * @return {?}
             */
            () => {
                this.onLoadSubject.next(true);
                this.onLoadSubject.complete();
            });
            script.onerror = (/**
             * @return {?}
             */
            () => {
                console.error('Failed to load the google chart script!');
                this.onLoadSubject.error('Failed to load the google chart script!');
                this.onLoadSubject.complete();
            });
        }
    }
    /**
     * @private
     * @return {?}
     */
    createScriptElement() {
        /** @type {?} */
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scriptSource;
        script.async = true;
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    }
}
ScriptLoaderService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
ScriptLoaderService.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: String, decorators: [{ type: Inject, args: [GOOGLE_API_KEY,] }, { type: Optional }] },
    { type: String, decorators: [{ type: Inject, args: [CHART_VERSION,] }, { type: Optional }] }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    ScriptLoaderService.prototype.scriptSource;
    /**
     * @type {?}
     * @private
     */
    ScriptLoaderService.prototype.onLoadSubject;
    /**
     * @type {?}
     * @private
     */
    ScriptLoaderService.prototype.localeId;
    /**
     * @type {?}
     * @private
     */
    ScriptLoaderService.prototype.googleApiKey;
    /**
     * @type {?}
     * @private
     */
    ScriptLoaderService.prototype.chartVersion;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1nb29nbGUtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL3NjcmlwdC1sb2FkZXIvc2NyaXB0LWxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR2pGLE1BQU0sT0FBTyxtQkFBbUI7Ozs7OztJQUs5QixZQUM2QixRQUFnQixFQUNDLFlBQXFCLEVBQ3RCLFlBQXFCO1FBRnJDLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDQyxpQkFBWSxHQUFaLFlBQVksQ0FBUztRQUN0QixpQkFBWSxHQUFaLFlBQVksQ0FBUztRQVBqRCxpQkFBWSxHQUFHLDBDQUEwQyxDQUFDO1FBRW5FLGtCQUFhLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQU83QyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQzs7OztJQUVELElBQVcsT0FBTztRQUNoQixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDakI7UUFFRCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDM0MsQ0FBQzs7OztJQUVELElBQVcsV0FBVztRQUNwQixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQ3pFLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7Ozs7O0lBRUQsSUFBWSxTQUFTO1FBQ25CLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixPQUFPLEtBQUssQ0FBQztTQUNkOztjQUVLLFdBQVcsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7Y0FDakUsa0JBQWtCLEdBQUcsV0FBVyxDQUFDLElBQUk7Ozs7UUFBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFlBQVksRUFBQztRQUN2RixPQUFPLGtCQUFrQixLQUFLLFNBQVMsQ0FBQztJQUMxQyxDQUFDOzs7OztJQUVNLGlCQUFpQixDQUFDLFFBQXVCO1FBQzlDLE9BQU8sSUFBSSxVQUFVOzs7O1FBQUMsUUFBUSxDQUFDLEVBQUU7O2tCQUN6QixNQUFNLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtnQkFDdkIsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZO2FBQzlCO1lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLGlCQUFpQjs7O1lBQUMsR0FBRyxFQUFFO2dCQUNuQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QixDQUFDLEVBQUMsQ0FBQztRQUNMLENBQUMsRUFBQyxDQUFDO0lBQ0wsQ0FBQzs7Ozs7SUFFTyxVQUFVO1FBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTs7a0JBQ2xDLE1BQU0sR0FBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFFekMsTUFBTSxDQUFDLE1BQU07OztZQUFHLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFBLENBQUM7WUFFRixNQUFNLENBQUMsT0FBTzs7O1lBQUcsR0FBRyxFQUFFO2dCQUNwQixPQUFPLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7Z0JBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7Z0JBQ3BFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEMsQ0FBQyxDQUFBLENBQUM7U0FDSDtJQUNILENBQUM7Ozs7O0lBRU8sbUJBQW1COztjQUNuQixNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUM7UUFDL0MsTUFBTSxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztRQUNoQyxNQUFNLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDL0IsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7UUFDcEIsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM3RCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzs7WUFoRkYsVUFBVTs7Ozt5Q0FPTixNQUFNLFNBQUMsU0FBUzt5Q0FDaEIsTUFBTSxTQUFDLGNBQWMsY0FBRyxRQUFRO3lDQUNoQyxNQUFNLFNBQUMsYUFBYSxjQUFHLFFBQVE7Ozs7Ozs7SUFQbEMsMkNBQTJFOzs7OztJQUUzRSw0Q0FBK0M7Ozs7O0lBRzdDLHVDQUEyQzs7Ozs7SUFDM0MsMkNBQWlFOzs7OztJQUNqRSwyQ0FBZ0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBJbmplY3QsIExPQ0FMRV9JRCwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCwgb2YgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IEdPT0dMRV9BUElfS0VZLCBDSEFSVF9WRVJTSU9OIH0gZnJvbSAnLi4vbW9kZWxzL2luamVjdGlvbi10b2tlbnMubW9kZWwnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgU2NyaXB0TG9hZGVyU2VydmljZSB7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBzY3JpcHRTb3VyY2UgPSAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vY2hhcnRzL2xvYWRlci5qcyc7XHJcblxyXG4gIHByaXZhdGUgb25Mb2FkU3ViamVjdCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgQEluamVjdChMT0NBTEVfSUQpIHByaXZhdGUgbG9jYWxlSWQ6IHN0cmluZyxcclxuICAgIEBJbmplY3QoR09PR0xFX0FQSV9LRVkpIEBPcHRpb25hbCgpIHByaXZhdGUgZ29vZ2xlQXBpS2V5Pzogc3RyaW5nLFxyXG4gICAgQEluamVjdChDSEFSVF9WRVJTSU9OKSBAT3B0aW9uYWwoKSBwcml2YXRlIGNoYXJ0VmVyc2lvbj86IHN0cmluZ1xyXG4gICkge1xyXG4gICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IG9uUmVhZHkoKTogT2JzZXJ2YWJsZTxib29sZWFuPiB7XHJcbiAgICBpZiAodGhpcy5kb25lTG9hZGluZykge1xyXG4gICAgICByZXR1cm4gb2YodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMub25Mb2FkU3ViamVjdC5hc09ic2VydmFibGUoKTtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBnZXQgZG9uZUxvYWRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodHlwZW9mIGdvb2dsZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGdvb2dsZS5jaGFydHMgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2V0IGlzTG9hZGluZygpOiBib29sZWFuIHtcclxuICAgIGlmICh0aGlzLmRvbmVMb2FkaW5nKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYWdlU2NyaXB0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3NjcmlwdCcpKTtcclxuICAgIGNvbnN0IGdvb2dsZUNoYXJ0c1NjcmlwdCA9IHBhZ2VTY3JpcHRzLmZpbmQoc2NyaXB0ID0+IHNjcmlwdC5zcmMgPT09IHRoaXMuc2NyaXB0U291cmNlKTtcclxuICAgIHJldHVybiBnb29nbGVDaGFydHNTY3JpcHQgIT09IHVuZGVmaW5lZDtcclxuICB9XHJcblxyXG4gIHB1YmxpYyBsb2FkQ2hhcnRQYWNrYWdlcyhwYWNrYWdlczogQXJyYXk8c3RyaW5nPik6IE9ic2VydmFibGU8dm9pZD4ge1xyXG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKG9ic2VydmVyID0+IHtcclxuICAgICAgY29uc3QgY29uZmlnID0ge1xyXG4gICAgICAgIHBhY2thZ2VzOiBwYWNrYWdlcyxcclxuICAgICAgICBsYW5ndWFnZTogdGhpcy5sb2NhbGVJZCxcclxuICAgICAgICBtYXBzQXBpS2V5OiB0aGlzLmdvb2dsZUFwaUtleVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgZ29vZ2xlLmNoYXJ0cy5sb2FkKHRoaXMuY2hhcnRWZXJzaW9uLCBjb25maWcpO1xyXG4gICAgICBnb29nbGUuY2hhcnRzLnNldE9uTG9hZENhbGxiYWNrKCgpID0+IHtcclxuICAgICAgICBvYnNlcnZlci5uZXh0KCk7XHJcbiAgICAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaW5pdGlhbGl6ZSgpIHtcclxuICAgIGlmICghdGhpcy5kb25lTG9hZGluZyAmJiAhdGhpcy5pc0xvYWRpbmcpIHtcclxuICAgICAgY29uc3Qgc2NyaXB0ID0gdGhpcy5jcmVhdGVTY3JpcHRFbGVtZW50KCk7XHJcblxyXG4gICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMub25Mb2FkU3ViamVjdC5uZXh0KHRydWUpO1xyXG4gICAgICAgIHRoaXMub25Mb2FkU3ViamVjdC5jb21wbGV0ZSgpO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgc2NyaXB0Lm9uZXJyb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGxvYWQgdGhlIGdvb2dsZSBjaGFydCBzY3JpcHQhJyk7XHJcbiAgICAgICAgdGhpcy5vbkxvYWRTdWJqZWN0LmVycm9yKCdGYWlsZWQgdG8gbG9hZCB0aGUgZ29vZ2xlIGNoYXJ0IHNjcmlwdCEnKTtcclxuICAgICAgICB0aGlzLm9uTG9hZFN1YmplY3QuY29tcGxldGUoKTtcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlU2NyaXB0RWxlbWVudCgpOiBIVE1MU2NyaXB0RWxlbWVudCB7XHJcbiAgICBjb25zdCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XHJcbiAgICBzY3JpcHQuc3JjID0gdGhpcy5zY3JpcHRTb3VyY2U7XHJcbiAgICBzY3JpcHQuYXN5bmMgPSB0cnVlO1xyXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpO1xyXG4gICAgcmV0dXJuIHNjcmlwdDtcclxuICB9XHJcbn1cclxuIl19