import { InjectionToken, Injectable, Inject, LOCALE_ID, Optional, EventEmitter, Component, ChangeDetectionStrategy, ElementRef, Input, Output, NgModule } from '@angular/core';
import { Subject, of, Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const CHART_VERSION = new InjectionToken('CHART_VERSION');
/** @type {?} */
const GOOGLE_API_KEY = new InjectionToken('GOOGLE_API_KEY');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class ScriptLoaderService {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GoogleChartPackagesHelper {
    /**
     * @param {?} chartName
     * @return {?}
     */
    static getPackageForChartName(chartName) {
        return GoogleChartPackagesHelper.ChartTypesToPackages[chartName];
    }
}
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class RawChartComponent {
    /**
     * @param {?} element
     * @param {?} loaderService
     */
    constructor(element, loaderService) {
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
    ngOnInit() {
        if (this.chartData == null) {
            throw new Error('Can\'t create a Google Chart without data!');
        }
        this.loaderService.onReady.subscribe((/**
         * @return {?}
         */
        () => {
            this.createChart();
        }));
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.addResizeListener();
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.wrapper) {
            this.updateChart();
        }
    }
    /**
     * @return {?}
     */
    getChartElement() {
        return this.element.nativeElement.firstElementChild;
    }
    /**
     * @protected
     * @return {?}
     */
    createChart() {
        this.loadNeededPackages().subscribe((/**
         * @return {?}
         */
        () => {
            this.wrapper = new google.visualization.ChartWrapper();
            this.updateChart();
        }));
    }
    /**
     * @protected
     * @return {?}
     */
    loadNeededPackages() {
        return this.loaderService.loadChartPackages([GoogleChartPackagesHelper.getPackageForChartName(this.chartData.chartType)]);
    }
    /**
     * @protected
     * @return {?}
     */
    updateChart() {
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
    }
    /**
     * @protected
     * @param {?} dataTable
     * @return {?}
     */
    formatData(dataTable) {
        if (this.formatter instanceof Array) {
            this.formatter.forEach((/**
             * @param {?} value
             * @return {?}
             */
            value => {
                value.formatter.format(dataTable, value.colIndex);
            }));
        }
        else {
            for (let i = 0; i < dataTable.getNumberOfColumns(); i++) {
                this.formatter.format(dataTable, i);
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    addResizeListener() {
        if (this.dynamicResize) {
            fromEvent(window, 'resize')
                .pipe(debounceTime(100))
                .subscribe((/**
             * @return {?}
             */
            () => {
                this.ngOnChanges();
            }));
        }
    }
    /**
     * @private
     * @return {?}
     */
    removeChartEvents() {
        google.visualization.events.removeAllListeners(this.wrapper);
    }
    /**
     * @private
     * @return {?}
     */
    registerChartEvents() {
        this.registerChartEvent(this.wrapper, 'ready', (/**
         * @return {?}
         */
        () => {
            this.registerChartEvent(this.wrapper.getChart(), 'onmouseover', (/**
             * @param {?} event
             * @return {?}
             */
            event => this.mouseenter.emit(event)));
            this.registerChartEvent(this.wrapper.getChart(), 'onmouseout', (/**
             * @param {?} event
             * @return {?}
             */
            event => this.mouseleave.emit(event)));
            this.ready.emit('Chart Ready');
        }));
        this.registerChartEvent(this.wrapper, 'error', (/**
         * @param {?} error
         * @return {?}
         */
        error => this.error.emit(error)));
        this.registerChartEvent(this.wrapper, 'select', (/**
         * @return {?}
         */
        () => {
            /** @type {?} */
            const selection = this.wrapper.getChart().getSelection();
            this.select.emit(selection);
        }));
    }
    /**
     * @private
     * @param {?} object
     * @param {?} eventName
     * @param {?} callback
     * @return {?}
     */
    registerChartEvent(object, eventName, callback) {
        google.visualization.events.addListener(object, eventName, callback);
    }
}
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
RawChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ScriptLoaderService }
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class GoogleChartComponent extends RawChartComponent {
    /**
     * @param {?} element
     * @param {?} loaderService
     */
    constructor(element, loaderService) {
        super(element, loaderService);
        this.roles = new Array();
        this.width = undefined;
        this.height = undefined;
        this.options = {};
    }
    /**
     * @return {?}
     */
    ngOnInit() {
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
        () => {
            this.createChart();
        }));
    }
    /**
     * @return {?}
     */
    ngOnChanges() {
        if (this.wrapper) {
            this.chartData = {
                chartType: this.type,
                dataTable: this.getDataTable(),
                options: this.parseOptions()
            };
        }
        super.ngOnChanges();
    }
    /**
     * @protected
     * @return {?}
     */
    parseOptions() {
        return Object.assign({ title: this.title, width: this.width, height: this.height }, this.options);
    }
    /**
     * @protected
     * @return {?}
     */
    createChart() {
        this.loadNeededPackages().subscribe((/**
         * @return {?}
         */
        () => {
            this.chartData = {
                chartType: this.type,
                dataTable: this.getDataTable(),
                options: this.parseOptions()
            };
            this.wrapper = new google.visualization.ChartWrapper();
            this.updateChart();
        }));
    }
    /**
     * @protected
     * @return {?}
     */
    getDataTable() {
        if (this.columnNames) {
            /** @type {?} */
            const columns = this.parseRoles(this.columnNames);
            this.firstRowIsData = false;
            return [columns, ...this.data];
        }
        else {
            this.firstRowIsData = true;
            return this.data;
        }
    }
    /**
     * @private
     * @param {?} columnNames
     * @return {?}
     */
    parseRoles(columnNames) {
        /** @type {?} */
        const columnNamesWithRoles = columnNames.slice();
        if (this.roles) {
            // Roles must be copied to avoid modifying the index everytime there's a change from ngOnChanges.
            /** @type {?} */
            const copyRoles = this.roles.map((/**
             * @param {?} role
             * @return {?}
             */
            role => Object.assign({}, role)));
            copyRoles.forEach((/**
             * @param {?} role
             * @return {?}
             */
            role => {
                /** @type {?} */
                const roleData = {
                    type: role.type,
                    role: role.role
                };
                if (role.p) {
                    roleData.p = role.p;
                }
                if (role.index != null) {
                    columnNamesWithRoles.splice(role.index + 1, 0, roleData);
                    for (const otherRole of copyRoles) {
                        if (otherRole === role) {
                            continue;
                        }
                        if (otherRole.index > role.index) {
                            otherRole.index++;
                        }
                    }
                }
                else {
                    columnNamesWithRoles.push(roleData);
                }
            }));
        }
        return columnNamesWithRoles;
    }
}
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
GoogleChartComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ScriptLoaderService }
];
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const GOOGLE_CHARTS_PROVIDERS = [
    {
        provide: ScriptLoaderService,
        useFactory: setupScriptLoaderService,
        deps: [LOCALE_ID, GOOGLE_API_KEY, CHART_VERSION]
    }
];
class GoogleChartsModule {
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
