(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('rxjs/operators')) :
    typeof define === 'function' && define.amd ? define('angular-google-charts', ['exports', '@angular/core', 'rxjs', 'rxjs/operators'], factory) :
    (global = global || self, factory(global['angular-google-charts'] = {}, global.ng.core, global.rxjs, global.rxjs.operators));
}(this, function (exports, core, rxjs, operators) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var CHART_VERSION = new core.InjectionToken('CHART_VERSION');
    /** @type {?} */
    var GOOGLE_API_KEY = new core.InjectionToken('GOOGLE_API_KEY');

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
            this.onLoadSubject = new rxjs.Subject();
            this.initialize();
        }
        Object.defineProperty(ScriptLoaderService.prototype, "onReady", {
            get: /**
             * @return {?}
             */
            function () {
                if (this.doneLoading) {
                    return rxjs.of(true);
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
            return new rxjs.Observable((/**
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        ScriptLoaderService.ctorParameters = function () { return [
            { type: String, decorators: [{ type: core.Inject, args: [core.LOCALE_ID,] }] },
            { type: String, decorators: [{ type: core.Inject, args: [GOOGLE_API_KEY,] }, { type: core.Optional }] },
            { type: String, decorators: [{ type: core.Inject, args: [CHART_VERSION,] }, { type: core.Optional }] }
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
            this.error = new core.EventEmitter();
            this.ready = new core.EventEmitter();
            this.select = new core.EventEmitter();
            this.mouseenter = new core.EventEmitter();
            this.mouseleave = new core.EventEmitter();
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
                rxjs.fromEvent(window, 'resize')
                    .pipe(operators.debounceTime(100))
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
            { type: core.Component, args: [{
                        // tslint:disable-next-line:component-selector
                        selector: 'raw-chart',
                        template: '',
                        exportAs: 'raw-chart',
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: [':host { width: fit-content; display: block; }']
                    }] }
        ];
        /** @nocollapse */
        RawChartComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: ScriptLoaderService }
        ]; };
        RawChartComponent.propDecorators = {
            chartData: [{ type: core.Input }],
            formatter: [{ type: core.Input }],
            dynamicResize: [{ type: core.Input }],
            firstRowIsData: [{ type: core.Input }],
            error: [{ type: core.Output }],
            ready: [{ type: core.Output }],
            select: [{ type: core.Output }],
            mouseenter: [{ type: core.Output }],
            mouseleave: [{ type: core.Output }]
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
            { type: core.Component, args: [{
                        // tslint:disable-next-line:component-selector
                        selector: 'google-chart',
                        template: '',
                        exportAs: 'google-chart',
                        changeDetection: core.ChangeDetectionStrategy.OnPush,
                        styles: [':host { width: fit-content; display: block; }']
                    }] }
        ];
        /** @nocollapse */
        GoogleChartComponent.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: ScriptLoaderService }
        ]; };
        GoogleChartComponent.propDecorators = {
            data: [{ type: core.Input }],
            columnNames: [{ type: core.Input }],
            roles: [{ type: core.Input }],
            title: [{ type: core.Input }],
            width: [{ type: core.Input }],
            height: [{ type: core.Input }],
            options: [{ type: core.Input }],
            type: [{ type: core.Input }]
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
            deps: [core.LOCALE_ID, GOOGLE_API_KEY, CHART_VERSION]
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
            { type: core.NgModule, args: [{
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

    exports.GoogleChartComponent = GoogleChartComponent;
    exports.GoogleChartPackagesHelper = GoogleChartPackagesHelper;
    exports.GoogleChartsModule = GoogleChartsModule;
    exports.RawChartComponent = RawChartComponent;
    exports.ScriptLoaderService = ScriptLoaderService;
    exports.ɵa = GOOGLE_CHARTS_PROVIDERS;
    exports.ɵb = setupScriptLoaderService;
    exports.ɵc = CHART_VERSION;
    exports.ɵd = GOOGLE_API_KEY;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=angular-google-charts.umd.js.map
