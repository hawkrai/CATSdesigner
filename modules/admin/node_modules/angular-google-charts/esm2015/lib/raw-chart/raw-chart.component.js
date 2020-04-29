/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="google.visualization"/>
/// <reference types="google.visualization"/>
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { GoogleChartPackagesHelper } from '../helpers/google-chart-packages.helper';
export class RawChartComponent {
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
if (false) {
    /** @type {?} */
    RawChartComponent.prototype.chartData;
    /** @type {?} */
    RawChartComponent.prototype.formatter;
    /** @type {?} */
    RawChartComponent.prototype.dynamicResize;
    /** @type {?} */
    RawChartComponent.prototype.firstRowIsData;
    /** @type {?} */
    RawChartComponent.prototype.error;
    /** @type {?} */
    RawChartComponent.prototype.ready;
    /** @type {?} */
    RawChartComponent.prototype.select;
    /** @type {?} */
    RawChartComponent.prototype.mouseenter;
    /** @type {?} */
    RawChartComponent.prototype.mouseleave;
    /** @type {?} */
    RawChartComponent.prototype.wrapper;
    /**
     * @type {?}
     * @private
     */
    RawChartComponent.prototype.dataTable;
    /**
     * @type {?}
     * @protected
     */
    RawChartComponent.prototype.element;
    /**
     * @type {?}
     * @protected
     */
    RawChartComponent.prototype.loaderService;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9yYXctY2hhcnQvcmF3LWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkNBQTZDOztBQUU3QyxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBSVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHOUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFVcEYsTUFBTSxPQUFPLGlCQUFpQjs7Ozs7SUFxQzVCLFlBQXNCLE9BQW1CLEVBQVksYUFBa0M7UUFBakUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFZLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQXhCdkYsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFHdEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFHdkIsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRzVDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzNCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBR3hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzVDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO0lBTThDLENBQUM7Ozs7SUFFM0YsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDMUIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFD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QUdOLE1BQU07cUJBR04sTUFBTTt5QkFHTixNQUFNO3lCQUdOLE1BQU07Ozs7SUE3QlAsc0NBQzJDOztJQUUzQyxzQ0FNTzs7SUFFUCwwQ0FDc0I7O0lBRXRCLDJDQUN1Qjs7SUFFdkIsa0NBQzRDOztJQUU1QyxrQ0FDMkI7O0lBRTNCLG1DQUN3Qzs7SUFFeEMsdUNBQzRDOztJQUU1Qyx1Q0FDNEM7O0lBRTVDLG9DQUEyQzs7Ozs7SUFFM0Msc0NBQWtEOzs7OztJQUV0QyxvQ0FBNkI7Ozs7O0lBQUUsMENBQTRDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUudmlzdWFsaXphdGlvblwiLz5cclxuXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIEFmdGVyVmlld0luaXRcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7IENoYXJ0RXJyb3JFdmVudCwgQ2hhcnRFdmVudCB9IGZyb20gJy4uL21vZGVscy9ldmVudHMubW9kZWwnO1xyXG5pbXBvcnQgeyBTY3JpcHRMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2NyaXB0LWxvYWRlci9zY3JpcHQtbG9hZGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBHb29nbGVDaGFydFBhY2thZ2VzSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9nb29nbGUtY2hhcnQtcGFja2FnZXMuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcclxuICBzZWxlY3RvcjogJ3Jhdy1jaGFydCcsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG4gIHN0eWxlczogWyc6aG9zdCB7IHdpZHRoOiBmaXQtY29udGVudDsgZGlzcGxheTogYmxvY2s7IH0nXSxcclxuICBleHBvcnRBczogJ3Jhdy1jaGFydCcsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFJhd0NoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgY2hhcnREYXRhOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFNwZWNzO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGZvcm1hdHRlcjpcclxuICAgIHwgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGVmYXVsdEZvcm1hdHRlclxyXG4gICAgfCBBcnJheTx7XHJcbiAgICAgICAgZm9ybWF0dGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5EZWZhdWx0Rm9ybWF0dGVyO1xyXG4gICAgICAgIGNvbEluZGV4OiBudW1iZXI7XHJcbiAgICAgIH0+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGR5bmFtaWNSZXNpemUgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBmaXJzdFJvd0lzRGF0YSA9IGZhbHNlO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBlcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBtb3VzZWVudGVyID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBtb3VzZWxlYXZlID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEV2ZW50PigpO1xyXG5cclxuICB3cmFwcGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI7XHJcblxyXG4gIHByaXZhdGUgZGF0YVRhYmxlOiBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgbG9hZGVyU2VydmljZTogU2NyaXB0TG9hZGVyU2VydmljZSkge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5jaGFydERhdGEgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgY3JlYXRlIGEgR29vZ2xlIENoYXJ0IHdpdGhvdXQgZGF0YSEnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uub25SZWFkeS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuYWRkUmVzaXplTGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKCkge1xyXG4gICAgaWYgKHRoaXMud3JhcHBlcikge1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0Q2hhcnRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBjcmVhdGVDaGFydCgpIHtcclxuICAgIHRoaXMubG9hZE5lZWRlZFBhY2thZ2VzKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcigpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBsb2FkTmVlZGVkUGFja2FnZXMoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sb2FkZXJTZXJ2aWNlLmxvYWRDaGFydFBhY2thZ2VzKFtHb29nbGVDaGFydFBhY2thZ2VzSGVscGVyLmdldFBhY2thZ2VGb3JDaGFydE5hbWUodGhpcy5jaGFydERhdGEuY2hhcnRUeXBlKV0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHVwZGF0ZUNoYXJ0KCkge1xyXG4gICAgLy8gVGhpcyBjaGVjayBoZXJlIGlzIGltcG9ydGFudCB0byBhbGxvdyBwYXNzaW5nIG9mIGEgY3JlYXRlZCBkYXRhVGFibGUgYXMgd2VsbCBhcyBqdXN0IGFuIGFycmF5XHJcbiAgICBpZiAoISh0aGlzLmNoYXJ0RGF0YS5kYXRhVGFibGUgaW5zdGFuY2VvZiBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUpKSB7XHJcbiAgICAgIHRoaXMuZGF0YVRhYmxlID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZSg8YW55W10+dGhpcy5jaGFydERhdGEuZGF0YVRhYmxlLCB0aGlzLmZpcnN0Um93SXNEYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0YVRhYmxlID0gdGhpcy5jaGFydERhdGEuZGF0YVRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMud3JhcHBlci5zZXREYXRhVGFibGUodGhpcy5kYXRhVGFibGUpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldENoYXJ0VHlwZSh0aGlzLmNoYXJ0RGF0YS5jaGFydFR5cGUpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldE9wdGlvbnModGhpcy5jaGFydERhdGEub3B0aW9ucyk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0RGF0YVNvdXJjZVVybCh0aGlzLmNoYXJ0RGF0YS5kYXRhU291cmNlVXJsKTtcclxuICAgIHRoaXMud3JhcHBlci5zZXRRdWVyeSh0aGlzLmNoYXJ0RGF0YS5xdWVyeSk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0UmVmcmVzaEludGVydmFsKHRoaXMuY2hhcnREYXRhLnJlZnJlc2hJbnRlcnZhbCk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0Vmlldyh0aGlzLmNoYXJ0RGF0YS52aWV3KTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUNoYXJ0RXZlbnRzKCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudHMoKTtcclxuXHJcbiAgICBpZiAodGhpcy5mb3JtYXR0ZXIpIHtcclxuICAgICAgdGhpcy5mb3JtYXREYXRhKHRoaXMuZGF0YVRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgZm9ybWF0RGF0YShkYXRhVGFibGU6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSkge1xyXG4gICAgaWYgKHRoaXMuZm9ybWF0dGVyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgdGhpcy5mb3JtYXR0ZXIuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgdmFsdWUuZm9ybWF0dGVyLmZvcm1hdChkYXRhVGFibGUsIHZhbHVlLmNvbEluZGV4KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFUYWJsZS5nZXROdW1iZXJPZkNvbHVtbnMoKTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXIuZm9ybWF0KGRhdGFUYWJsZSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkUmVzaXplTGlzdGVuZXIoKSB7XHJcbiAgICBpZiAodGhpcy5keW5hbWljUmVzaXplKSB7XHJcbiAgICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKVxyXG4gICAgICAgIC5waXBlKGRlYm91bmNlVGltZSgxMDApKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5uZ09uQ2hhbmdlcygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDaGFydEV2ZW50cygpIHtcclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnModGhpcy53cmFwcGVyKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50cygpIHtcclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3JlYWR5JywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIuZ2V0Q2hhcnQoKSwgJ29ubW91c2VvdmVyJywgZXZlbnQgPT4gdGhpcy5tb3VzZWVudGVyLmVtaXQoZXZlbnQpKTtcclxuICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLmdldENoYXJ0KCksICdvbm1vdXNlb3V0JywgZXZlbnQgPT4gdGhpcy5tb3VzZWxlYXZlLmVtaXQoZXZlbnQpKTtcclxuXHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdCgnQ2hhcnQgUmVhZHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ2Vycm9yJywgZXJyb3IgPT4gdGhpcy5lcnJvci5lbWl0KGVycm9yKSk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIsICdzZWxlY3QnLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMud3JhcHBlci5nZXRDaGFydCgpLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KHNlbGVjdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50KG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMuYWRkTGlzdGVuZXIob2JqZWN0LCBldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICB9XHJcbn1cclxuIl19