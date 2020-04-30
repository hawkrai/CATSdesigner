/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, Inject, LOCALE_ID, Optional } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { GOOGLE_API_KEY, CHART_VERSION } from '../models/injection-tokens.model';
var ScriptLoaderService = /** @class */ (function () {
    function ScriptLoaderService(localeId, googleApiKey, chartVersion) {
        this.localeId = localeId;
        this.googleApiKey = googleApiKey;
        this.chartVersion = chartVersion;
        this.scriptSource = 'https://www.gstatic.com/charts/loader.js';
        this.onLoadSubject = new Subject();
        this.initialize();
    }
    Object.defineProperty(ScriptLoaderService.prototype, "onReady", {
        get: /**
         * @return {?}
         */
        function () {
            if (this.doneLoading) {
                return of(true);
            }
            return this.onLoadSubject.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScriptLoaderService.prototype, "doneLoading", {
        get: /**
         * @return {?}
         */
        function () {
            if (typeof google === 'undefined' || typeof google.charts === 'undefined') {
                return false;
            }
            return true;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ScriptLoaderService.prototype, "isLoading", {
        get: /**
         * @private
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.doneLoading) {
                return false;
            }
            /** @type {?} */
            var pageScripts = Array.from(document.getElementsByTagName('script'));
            /** @type {?} */
            var googleChartsScript = pageScripts.find((/**
             * @param {?} script
             * @return {?}
             */
            function (script) { return script.src === _this.scriptSource; }));
            return googleChartsScript !== undefined;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} packages
     * @return {?}
     */
    ScriptLoaderService.prototype.loadChartPackages = /**
     * @param {?} packages
     * @return {?}
     */
    function (packages) {
        var _this = this;
        return new Observable((/**
         * @param {?} observer
         * @return {?}
         */
        function (observer) {
            /** @type {?} */
            var config = {
                packages: packages,
                language: _this.localeId,
                mapsApiKey: _this.googleApiKey
            };
            google.charts.load(_this.chartVersion, config);
            google.charts.setOnLoadCallback((/**
             * @return {?}
             */
            function () {
                observer.next();
                observer.complete();
            }));
        }));
    };
    /**
     * @private
     * @return {?}
     */
    ScriptLoaderService.prototype.initialize = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (!this.doneLoading && !this.isLoading) {
            /** @type {?} */
            var script = this.createScriptElement();
            script.onload = (/**
             * @return {?}
             */
            function () {
                _this.onLoadSubject.next(true);
                _this.onLoadSubject.complete();
            });
            script.onerror = (/**
             * @return {?}
             */
            function () {
                console.error('Failed to load the google chart script!');
                _this.onLoadSubject.error('Failed to load the google chart script!');
                _this.onLoadSubject.complete();
            });
        }
    };
    /**
     * @private
     * @return {?}
     */
    ScriptLoaderService.prototype.createScriptElement = /**
     * @private
     * @return {?}
     */
    function () {
        /** @type {?} */
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scriptSource;
        script.async = true;
        document.getElementsByTagName('head')[0].appendChild(script);
        return script;
    };
    ScriptLoaderService.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    ScriptLoaderService.ctorParameters = function () { return [
        { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
        { type: String, decorators: [{ type: Inject, args: [GOOGLE_API_KEY,] }, { type: Optional }] },
        { type: String, decorators: [{ type: Inject, args: [CHART_VERSION,] }, { type: Optional }] }
    ]; };
    return ScriptLoaderService;
}());
export { ScriptLoaderService };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LWxvYWRlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1nb29nbGUtY2hhcnRzLyIsInNvdXJjZXMiOlsibGliL3NjcmlwdC1sb2FkZXIvc2NyaXB0LWxvYWRlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUUvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBRWpGO0lBTUUsNkJBQzZCLFFBQWdCLEVBQ0MsWUFBcUIsRUFDdEIsWUFBcUI7UUFGckMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNDLGlCQUFZLEdBQVosWUFBWSxDQUFTO1FBQ3RCLGlCQUFZLEdBQVosWUFBWSxDQUFTO1FBUGpELGlCQUFZLEdBQUcsMENBQTBDLENBQUM7UUFFbkUsa0JBQWEsR0FBRyxJQUFJLE9BQU8sRUFBVyxDQUFDO1FBTzdDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsc0JBQVcsd0NBQU87Ozs7UUFBbEI7WUFDRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2pCO1lBRUQsT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQzNDLENBQUM7OztPQUFBO0lBRUQsc0JBQVcsNENBQVc7Ozs7UUFBdEI7WUFDRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO2dCQUN6RSxPQUFPLEtBQUssQ0FBQzthQUNkO1lBRUQsT0FBTyxJQUFJLENBQUM7UUFD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bnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0LCBMT0NBTEVfSUQsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YmplY3QsIG9mIH0gZnJvbSAncnhqcyc7XHJcblxyXG5pbXBvcnQgeyBHT09HTEVfQVBJX0tFWSwgQ0hBUlRfVkVSU0lPTiB9IGZyb20gJy4uL21vZGVscy9pbmplY3Rpb24tdG9rZW5zLm1vZGVsJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFNjcmlwdExvYWRlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgcmVhZG9ubHkgc2NyaXB0U291cmNlID0gJ2h0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2NoYXJ0cy9sb2FkZXIuanMnO1xyXG5cclxuICBwcml2YXRlIG9uTG9hZFN1YmplY3QgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIEBJbmplY3QoTE9DQUxFX0lEKSBwcml2YXRlIGxvY2FsZUlkOiBzdHJpbmcsXHJcbiAgICBASW5qZWN0KEdPT0dMRV9BUElfS0VZKSBAT3B0aW9uYWwoKSBwcml2YXRlIGdvb2dsZUFwaUtleT86IHN0cmluZyxcclxuICAgIEBJbmplY3QoQ0hBUlRfVkVSU0lPTikgQE9wdGlvbmFsKCkgcHJpdmF0ZSBjaGFydFZlcnNpb24/OiBzdHJpbmdcclxuICApIHtcclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGdldCBvblJlYWR5KCk6IE9ic2VydmFibGU8Ym9vbGVhbj4ge1xyXG4gICAgaWYgKHRoaXMuZG9uZUxvYWRpbmcpIHtcclxuICAgICAgcmV0dXJuIG9mKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLm9uTG9hZFN1YmplY3QuYXNPYnNlcnZhYmxlKCk7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0IGRvbmVMb2FkaW5nKCk6IGJvb2xlYW4ge1xyXG4gICAgaWYgKHR5cGVvZiBnb29nbGUgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBnb29nbGUuY2hhcnRzID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdldCBpc0xvYWRpbmcoKTogYm9vbGVhbiB7XHJcbiAgICBpZiAodGhpcy5kb25lTG9hZGluZykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcGFnZVNjcmlwdHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdzY3JpcHQnKSk7XHJcbiAgICBjb25zdCBnb29nbGVDaGFydHNTY3JpcHQgPSBwYWdlU2NyaXB0cy5maW5kKHNjcmlwdCA9PiBzY3JpcHQuc3JjID09PSB0aGlzLnNjcmlwdFNvdXJjZSk7XHJcbiAgICByZXR1cm4gZ29vZ2xlQ2hhcnRzU2NyaXB0ICE9PSB1bmRlZmluZWQ7XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgbG9hZENoYXJ0UGFja2FnZXMocGFja2FnZXM6IEFycmF5PHN0cmluZz4pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcclxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnNlcnZlciA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbmZpZyA9IHtcclxuICAgICAgICBwYWNrYWdlczogcGFja2FnZXMsXHJcbiAgICAgICAgbGFuZ3VhZ2U6IHRoaXMubG9jYWxlSWQsXHJcbiAgICAgICAgbWFwc0FwaUtleTogdGhpcy5nb29nbGVBcGlLZXlcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGdvb2dsZS5jaGFydHMubG9hZCh0aGlzLmNoYXJ0VmVyc2lvbiwgY29uZmlnKTtcclxuICAgICAgZ29vZ2xlLmNoYXJ0cy5zZXRPbkxvYWRDYWxsYmFjaygoKSA9PiB7XHJcbiAgICAgICAgb2JzZXJ2ZXIubmV4dCgpO1xyXG4gICAgICAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGluaXRpYWxpemUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZG9uZUxvYWRpbmcgJiYgIXRoaXMuaXNMb2FkaW5nKSB7XHJcbiAgICAgIGNvbnN0IHNjcmlwdCA9IHRoaXMuY3JlYXRlU2NyaXB0RWxlbWVudCgpO1xyXG5cclxuICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLm9uTG9hZFN1YmplY3QubmV4dCh0cnVlKTtcclxuICAgICAgICB0aGlzLm9uTG9hZFN1YmplY3QuY29tcGxldGUoKTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBsb2FkIHRoZSBnb29nbGUgY2hhcnQgc2NyaXB0IScpO1xyXG4gICAgICAgIHRoaXMub25Mb2FkU3ViamVjdC5lcnJvcignRmFpbGVkIHRvIGxvYWQgdGhlIGdvb2dsZSBjaGFydCBzY3JpcHQhJyk7XHJcbiAgICAgICAgdGhpcy5vbkxvYWRTdWJqZWN0LmNvbXBsZXRlKCk7XHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGNyZWF0ZVNjcmlwdEVsZW1lbnQoKTogSFRNTFNjcmlwdEVsZW1lbnQge1xyXG4gICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgICBzY3JpcHQudHlwZSA9ICd0ZXh0L2phdmFzY3JpcHQnO1xyXG4gICAgc2NyaXB0LnNyYyA9IHRoaXMuc2NyaXB0U291cmNlO1xyXG4gICAgc2NyaXB0LmFzeW5jID0gdHJ1ZTtcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxuICAgIHJldHVybiBzY3JpcHQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==