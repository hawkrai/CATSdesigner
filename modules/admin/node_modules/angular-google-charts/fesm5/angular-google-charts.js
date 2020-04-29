import { __extends, __assign, __spread, __values } from 'tslib';
import { InjectionToken, Injectable, Inject, LOCALE_ID, Optional, Component, ChangeDetectionStrategy, ElementRef, Input, Output, EventEmitter, NgModule } from '@angular/core';
import { of, Observable, Subject, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var CHART_VERSION = new InjectionToken('CHART_VERSION');
/** @type {?} */
var GOOGLE_API_KEY = new InjectionToken('GOOGLE_API_KEY');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var GoogleChartPackagesHelper = /** @class */ (function () {
    function GoogleChartPackagesHelper() {
    }
    /**
     * @param {?} chartName
     * @return {?}
     */
    GoogleChartPackagesHelper.getPackageForChartName = /**
     * @param {?} chartName
     * @return {?}
     */
    function (chartName) {
        return GoogleChartPackagesHelper.ChartTypesToPackages[chartName];
    };
    GoogleChartPackagesHelper.ChartTypesToPackages = {
        AnnotationChart: 'annotationchart',
        AreaChart: 'corechart',
        Bar: 'bar',
        BarChart: 'corechart',
        BubbleChart: 'corechart',
        Calendar: 'calendar',
        CandlestickChart: 'corechart',
        ColumnChart: 'corechart',
        ComboChart: 'corechart',
        PieChart: 'corechart',
        Gantt: 'gantt',
        Gauge: 'gauge',
        GeoChart: 'geochart',
        Histogram: 'corechart',
        Line: 'line',
        LineChart: 'corechart',
        Map: 'map',
        OrgChart: 'orgchart',
        Sankey: 'sankey',
        Scatter: 'scatter',
        ScatterChart: 'corechart',
        SteppedAreaChart: 'corechart',
        Table: 'table',
        Timeline: 'timeline',
        TreeMap: 'treemap',
        WordTree: 'wordtree'
    };
    return GoogleChartPackagesHelper;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var RawChartComponent = /** @class */ (function () {
    function RawChartComponent(element, loaderService) {
        this.element = element;
        this.loaderService = loaderService;
        this.dynamicResize = false;
        this.firstRowIsData = false;
        this.error = new EventEmitter();
        this.ready = new EventEmitter();
        this.select = new EventEmitter();
        this.mouseenter = new EventEmitter();
        this.mouseleave = new EventEmitter();
    }
    /**
     * @return {?}
     */
    RawChartComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.chartData == null) {
            throw new Error('Can\'t create a Google Chart without data!');
        }
        this.loaderService.onReady.subscribe((/**
         * @return {?}
         */
        function () {
            _this.createChart();
        }));
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        this.addResizeListener();
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (this.wrapper) {
            this.updateChart();
        }
    };
    /**
     * @return {?}
     */
    RawChartComponent.prototype.getChartElement = /**
     * @return {?}
     */
    function () {
        return this.element.nativeElement.firstElementChild;
    };
    /**
     * @protected
     * @return {?}
     */
    RawChartComponent.prototype.createChart = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        this.loadNeededPackages().subscribe((/**
         * @return {?}
         */
        function () {
            _this.wrapper = new google.visualization.ChartWrapper();
            _this.updateChart();
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    RawChartComponent.prototype.loadNeededPackages = /**
     * @protected
     * @return {?}
     */
    function () {
        return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.chartData.chartType)]);
    };
    /**
     * @protected
     * @return {?}
     */
    RawChartComponent.prototype.updateChart = /**
     * @protected
     * @return {?}
     */
    function () {
        // This check here is important to allow passing of a created dataTable as well as just an array
        if (!(this.chartData.dataTable instanceof google.visualization.DataTable)) {
            this.dataTable = google.visualization.arrayToDataTable((/** @type {?} */ (this.chartData.dataTable)), this.firstRowIsData);
        }
        else {
            this.dataTable = this.chartData.dataTable;
        }
        this.wrapper.setDataTable(this.dataTable);
        this.wrapper.setChartType(this.chartData.chartType);
        this.wrapper.setOptions(this.chartData.options);
        this.wrapper.setDataSourceUrl(this.chartData.dataSourceUrl);
        this.wrapper.setQuery(this.chartData.query);
        this.wrapper.setRefreshInterval(this.chartData.refreshInterval);
        this.wrapper.setView(this.chartData.view);
        this.removeChartEvents();
        this.registerChartEvents();
        if (this.formatter) {
            this.formatData(this.dataTable);
        }
        this.wrapper.draw(this.element.nativeElement);
    };
    /**
     * @protected
     * @param {?} dataTable
     * @return {?}
     */
    RawChartComponent.prototype.formatData = /**
     * @protected
     * @param {?} dataTable
     * @return {?}
     */
    function (dataTable) {
        if (this.formatter instanceof Array) {
            this.formatter.forEach((/**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                value.formatter.format(dataTable, value.colIndex);
            }));
        }
        else {
            for (var i = 0; i < dataTable.getNumberOfColumns(); i++) {
                this.formatter.format(dataTable, i);
            }
        }
    };
    /**
     * @private
     * @return {?}
     */
    RawChartComponent.prototype.addResizeListener = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.dynamicResize) {
            fromEvent(window, 'resize')
                .pipe(debounceTime(100))
                .subscribe((/**
             * @return {?}
             */
            function () {
                _this.ngOnChanges();
            }));
        }
    };
    /**
     * @private
     * @return {?}
     */
    RawChartComponent.prototype.removeChartEvents = /**
     * @private
     * @return {?}
     */
    function () {
        google.visualization.events.removeAllListeners(this.wrapper);
    };
    /**
     * @private
     * @return {?}
     */
    RawChartComponent.prototype.registerChartEvents = /**
     * @private
     * @return {?}
     */
    function () {
        var _this = this;
        this.registerChartEvent(this.wrapper, 'ready', (/**
         * @return {?}
         */
        function () {
            _this.registerChartEvent(_this.wrapper.getChart(), 'onmouseover', (/**
             * @param {?} event
             * @return {?}
             */
            function (event) { return _this.mouseenter.emit(event); }));
            _this.registerChartEvent(_this.wrapper.getChart(), 'onmouseout', (/**
             * @param {?} event
             * @return {?}
             */
            function (event) { return _this.mouseleave.emit(event); }));
            _this.ready.emit('Chart Ready');
        }));
        this.registerChartEvent(this.wrapper, 'error', (/**
         * @param {?} error
         * @return {?}
         */
        function (error) { return _this.error.emit(error); }));
        this.registerChartEvent(this.wrapper, 'select', (/**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var selection = _this.wrapper.getChart().getSelection();
            _this.select.emit(selection);
        }));
    };
    /**
     * @private
     * @param {?} object
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    RawChartComponent.prototype.registerChartEvent = /**
     * @private
     * @param {?} object
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    function (object, eventName, callback) {
        google.visualization.events.addListener(object, eventName, callback);
    };
    RawChartComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'raw-chart',
                    template: '',
                    exportAs: 'raw-chart',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [':host { width: fit-content; display: block; }']
                }] }
    ];
    /** @nocollapse */
    RawChartComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ScriptLoaderService }
    ]; };
    RawChartComponent.propDecorators = {
        chartData: [{ type: Input }],
        formatter: [{ type: Input }],
        dynamicResize: [{ type: Input }],
        firstRowIsData: [{ type: Input }],
        error: [{ type: Output }],
        ready: [{ type: Output }],
        select: [{ type: Output }],
        mouseenter: [{ type: Output }],
        mouseleave: [{ type: Output }]
    };
    return RawChartComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var GoogleChartComponent = /** @class */ (function (_super) {
    __extends(GoogleChartComponent, _super);
    function GoogleChartComponent(element, loaderService) {
        var _this = _super.call(this, element, loaderService) || this;
        _this.roles = new Array();
        _this.width = undefined;
        _this.height = undefined;
        _this.options = {};
        return _this;
    }
    /**
     * @return {?}
     */
    GoogleChartComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.type == null) {
            throw new Error('Can\'t create a Google Chart without specifying a type!');
        }
        if (this.data == null) {
            throw new Error('Can\'t create a Google Chart without data!');
        }
        this.chartData = {
            chartType: this.type
        };
        this.loaderService.onReady.subscribe((/**
         * @return {?}
         */
        function () {
            _this.createChart();
        }));
    };
    /**
     * @return {?}
     */
    GoogleChartComponent.prototype.ngOnChanges = /**
     * @return {?}
     */
    function () {
        if (this.wrapper) {
            this.chartData = {
                chartType: this.type,
                dataTable: this.getDataTable(),
                options: this.parseOptions()
            };
        }
        _super.prototype.ngOnChanges.call(this);
    };
    /**
     * @protected
     * @return {?}
     */
    GoogleChartComponent.prototype.parseOptions = /**
     * @protected
     * @return {?}
     */
    function () {
        return __assign({ title: this.title, width: this.width, height: this.height }, this.options);
    };
    /**
     * @protected
     * @return {?}
     */
    GoogleChartComponent.prototype.createChart = /**
     * @protected
     * @return {?}
     */
    function () {
        var _this = this;
        this.loadNeededPackages().subscribe((/**
         * @return {?}
         */
        function () {
            _this.chartData = {
                chartType: _this.type,
                dataTable: _this.getDataTable(),
                options: _this.parseOptions()
            };
            _this.wrapper = new google.visualization.ChartWrapper();
            _this.updateChart();
        }));
    };
    /**
     * @protected
     * @return {?}
     */
    GoogleChartComponent.prototype.getDataTable = /**
     * @protected
     * @return {?}
     */
    function () {
        if (this.columnNames) {
            /** @type {?} */
            var columns = this.parseRoles(this.columnNames);
            this.firstRowIsData = false;
            return __spread([columns], this.data);
        }
        else {
            this.firstRowIsData = true;
            return this.data;
        }
    };
    /**
     * @private
     * @param {?} columnNames
     * @return {?}
     */
    GoogleChartComponent.prototype.parseRoles = /**
     * @private
     * @param {?} columnNames
     * @return {?}
     */
    function (columnNames) {
        /** @type {?} */
        var columnNamesWithRoles = columnNames.slice();
        if (this.roles) {
            // Roles must be copied to avoid modifying the index everytime there's a change from ngOnChanges.
            /** @type {?} */
            var copyRoles_1 = this.roles.map((/**
             * @param {?} role
             * @return {?}
             */
            function (role) { return Object.assign({}, role); }));
            copyRoles_1.forEach((/**
             * @param {?} role
             * @return {?}
             */
            function (role) {
                var e_1, _a;
                /** @type {?} */
                var roleData = {
                    type: role.type,
                    role: role.role
                };
                if (role.p) {
                    roleData.p = role.p;
                }
                if (role.index != null) {
                    columnNamesWithRoles.splice(role.index + 1, 0, roleData);
                    try {
                        for (var copyRoles_2 = __values(copyRoles_1), copyRoles_2_1 = copyRoles_2.next(); !copyRoles_2_1.done; copyRoles_2_1 = copyRoles_2.next()) {
                            var otherRole = copyRoles_2_1.value;
                            if (otherRole === role) {
                                continue;
                            }
                            if (otherRole.index > role.index) {
                                otherRole.index++;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (copyRoles_2_1 && !copyRoles_2_1.done && (_a = copyRoles_2.return)) _a.call(copyRoles_2);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    columnNamesWithRoles.push(roleData);
                }
            }));
        }
        return columnNamesWithRoles;
    };
    GoogleChartComponent.decorators = [
        { type: Component, args: [{
                    // tslint:disable-next-line:component-selector
                    selector: 'google-chart',
                    template: '',
                    exportAs: 'google-chart',
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    styles: [':host { width: fit-content; display: block; }']
                }] }
    ];
    /** @nocollapse */
    GoogleChartComponent.ctorParameters = function () { return [
        { type: ElementRef },
        { type: ScriptLoaderService }
    ]; };
    GoogleChartComponent.propDecorators = {
        data: [{ type: Input }],
        columnNames: [{ type: Input }],
        roles: [{ type: Input }],
        title: [{ type: Input }],
        width: [{ type: Input }],
        height: [{ type: Input }],
        options: [{ type: Input }],
        type: [{ type: Input }]
    };
    return GoogleChartComponent;
}(RawChartComponent));

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var GOOGLE_CHARTS_PROVIDERS = [
    {
        provide: ScriptLoaderService,
        useFactory: setupScriptLoaderService,
        deps: [LOCALE_ID, GOOGLE_API_KEY, CHART_VERSION]
    }
];
var GoogleChartsModule = /** @class */ (function () {
    function GoogleChartsModule() {
    }
    /**
     * @param {?=} googleApiKey
     * @param {?=} chartVersion
     * @return {?}
     */
    GoogleChartsModule.forRoot = /**
     * @param {?=} googleApiKey
     * @param {?=} chartVersion
     * @return {?}
     */
    function (googleApiKey, chartVersion) {
        return {
            ngModule: GoogleChartsModule,
            providers: [
                GOOGLE_CHARTS_PROVIDERS,
                { provide: GOOGLE_API_KEY, useValue: googleApiKey ? googleApiKey : '' },
                { provide: CHART_VERSION, useValue: chartVersion ? chartVersion : '46' }
            ]
        };
    };
    GoogleChartsModule.decorators = [
        { type: NgModule, args: [{
                    providers: [ScriptLoaderService],
                    declarations: [GoogleChartComponent, RawChartComponent],
                    exports: [GoogleChartComponent, RawChartComponent]
                },] }
    ];
    return GoogleChartsModule;
}());
/**
 * @param {?} localeId
 * @param {?} googleApiKey
 * @param {?} chartVersion
 * @return {?}
 */
function setupScriptLoaderService(localeId, googleApiKey, chartVersion) {
    return new ScriptLoaderService(localeId, googleApiKey, chartVersion);
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { GoogleChartComponent, GoogleChartPackagesHelper, GoogleChartsModule, RawChartComponent, ScriptLoaderService, GOOGLE_CHARTS_PROVIDERS as ɵa, setupScriptLoaderService as ɵb, CHART_VERSION as ɵc, GOOGLE_API_KEY as ɵd };
//# sourceMappingURL=angular-google-charts.js.map
