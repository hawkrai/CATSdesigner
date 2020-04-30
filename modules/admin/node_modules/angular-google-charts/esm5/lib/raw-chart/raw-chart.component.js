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
export { RawChartComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmF3LWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9yYXctY2hhcnQvcmF3LWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkNBQTZDOztBQUU3QyxPQUFPLEVBQ0wsU0FBUyxFQUNULHVCQUF1QixFQUN2QixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBSVgsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFjLFNBQVMsRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFHOUMsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0seUNBQXlDLENBQUM7QUFFcEY7SUE2Q0UsMkJBQXNCLE9BQW1CLEVBQVksYUFBa0M7UUFBakUsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUFZLGtCQUFhLEdBQWIsYUFBYSxDQUFxQjtRQXhCdkYsa0JBQWEsR0FBRyxLQUFLLENBQUM7UUFHdEIsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFHdkIsVUFBSyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBRzVDLFVBQUssR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBRzNCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBR3hDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRzVDLGVBQVUsR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO0lBTThDLENBQUM7Ozs7SUFFM0Ysb0NBQVE7OztJQUFSO1FBQUEsaUJBUUM7UUFQQyxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxFQUFFO1lBQzFCLE1BQU0sSUFBSSxLQUFLLENBQUMsNENBQTRDLENBQUMsQ0FBQztT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TUFBTTs2QkFGdEMsK0NBQStDO2lCQUd6RDs7OztnQkFuQkMsVUFBVTtnQkFTSCxtQkFBbUI7Ozs0QkFZekIsS0FBSzs0QkFHTCxLQUFLO2dDQVFMLEtBQUs7aUNBR0wsS0FBSzt3QkFHTCxNQUFNO3dCQUdOLE1BQU07eUJBR04sTUFBTTs2QkFHTixNQUFNOzZCQUdOLE1BQU07O0lBa0hULHdCQUFDO0NBQUEsQUF4SkQsSUF3SkM7U0FoSlksaUJBQWlCOzs7SUFDNUIsc0NBQzJDOztJQUUzQyxzQ0FNTzs7SUFFUCwwQ0FDc0I7O0lBRXRCLDJDQUN1Qjs7SUFFdkIsa0NBQzRDOztJQUU1QyxrQ0FDMkI7O0lBRTNCLG1DQUN3Qzs7SUFFeEMsdUNBQzRDOztJQUU1Qyx1Q0FDNEM7O0lBRTVDLG9DQUEyQzs7Ozs7SUFFM0Msc0NBQWtEOzs7OztJQUV0QyxvQ0FBNkI7Ozs7O0lBQUUsMENBQTRDIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUudmlzdWFsaXphdGlvblwiLz5cclxuXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIEFmdGVyVmlld0luaXRcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IGRlYm91bmNlVGltZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuXHJcbmltcG9ydCB7IENoYXJ0RXJyb3JFdmVudCwgQ2hhcnRFdmVudCB9IGZyb20gJy4uL21vZGVscy9ldmVudHMubW9kZWwnO1xyXG5pbXBvcnQgeyBTY3JpcHRMb2FkZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2NyaXB0LWxvYWRlci9zY3JpcHQtbG9hZGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBHb29nbGVDaGFydFBhY2thZ2VzSGVscGVyIH0gZnJvbSAnLi4vaGVscGVycy9nb29nbGUtY2hhcnQtcGFja2FnZXMuaGVscGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpjb21wb25lbnQtc2VsZWN0b3JcclxuICBzZWxlY3RvcjogJ3Jhdy1jaGFydCcsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG4gIHN0eWxlczogWyc6aG9zdCB7IHdpZHRoOiBmaXQtY29udGVudDsgZGlzcGxheTogYmxvY2s7IH0nXSxcclxuICBleHBvcnRBczogJ3Jhdy1jaGFydCcsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcclxufSlcclxuZXhwb3J0IGNsYXNzIFJhd0NoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgY2hhcnREYXRhOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFNwZWNzO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGZvcm1hdHRlcjpcclxuICAgIHwgZ29vZ2xlLnZpc3VhbGl6YXRpb24uRGVmYXVsdEZvcm1hdHRlclxyXG4gICAgfCBBcnJheTx7XHJcbiAgICAgICAgZm9ybWF0dGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5EZWZhdWx0Rm9ybWF0dGVyO1xyXG4gICAgICAgIGNvbEluZGV4OiBudW1iZXI7XHJcbiAgICAgIH0+O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGR5bmFtaWNSZXNpemUgPSBmYWxzZTtcclxuXHJcbiAgQElucHV0KClcclxuICBmaXJzdFJvd0lzRGF0YSA9IGZhbHNlO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBlcnJvciA9IG5ldyBFdmVudEVtaXR0ZXI8Q2hhcnRFcnJvckV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICByZWFkeSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcclxuXHJcbiAgQE91dHB1dCgpXHJcbiAgc2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBtb3VzZWVudGVyID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEV2ZW50PigpO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBtb3VzZWxlYXZlID0gbmV3IEV2ZW50RW1pdHRlcjxDaGFydEV2ZW50PigpO1xyXG5cclxuICB3cmFwcGVyOiBnb29nbGUudmlzdWFsaXphdGlvbi5DaGFydFdyYXBwZXI7XHJcblxyXG4gIHByaXZhdGUgZGF0YVRhYmxlOiBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGU7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50OiBFbGVtZW50UmVmLCBwcm90ZWN0ZWQgbG9hZGVyU2VydmljZTogU2NyaXB0TG9hZGVyU2VydmljZSkge31cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5jaGFydERhdGEgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgY3JlYXRlIGEgR29vZ2xlIENoYXJ0IHdpdGhvdXQgZGF0YSEnKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxvYWRlclNlcnZpY2Uub25SZWFkeS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNyZWF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcclxuICAgIHRoaXMuYWRkUmVzaXplTGlzdGVuZXIoKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKCkge1xyXG4gICAgaWYgKHRoaXMud3JhcHBlcikge1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwdWJsaWMgZ2V0Q2hhcnRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZDtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBjcmVhdGVDaGFydCgpIHtcclxuICAgIHRoaXMubG9hZE5lZWRlZFBhY2thZ2VzKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcigpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBsb2FkTmVlZGVkUGFja2FnZXMoKTogT2JzZXJ2YWJsZTx2b2lkPiB7XHJcbiAgICByZXR1cm4gdGhpcy5sb2FkZXJTZXJ2aWNlLmxvYWRDaGFydFBhY2thZ2VzKFtHb29nbGVDaGFydFBhY2thZ2VzSGVscGVyLmdldFBhY2thZ2VGb3JDaGFydE5hbWUodGhpcy5jaGFydERhdGEuY2hhcnRUeXBlKV0pO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIHVwZGF0ZUNoYXJ0KCkge1xyXG4gICAgLy8gVGhpcyBjaGVjayBoZXJlIGlzIGltcG9ydGFudCB0byBhbGxvdyBwYXNzaW5nIG9mIGEgY3JlYXRlZCBkYXRhVGFibGUgYXMgd2VsbCBhcyBqdXN0IGFuIGFycmF5XHJcbiAgICBpZiAoISh0aGlzLmNoYXJ0RGF0YS5kYXRhVGFibGUgaW5zdGFuY2VvZiBnb29nbGUudmlzdWFsaXphdGlvbi5EYXRhVGFibGUpKSB7XHJcbiAgICAgIHRoaXMuZGF0YVRhYmxlID0gZ29vZ2xlLnZpc3VhbGl6YXRpb24uYXJyYXlUb0RhdGFUYWJsZSg8YW55W10+dGhpcy5jaGFydERhdGEuZGF0YVRhYmxlLCB0aGlzLmZpcnN0Um93SXNEYXRhKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0YVRhYmxlID0gdGhpcy5jaGFydERhdGEuZGF0YVRhYmxlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMud3JhcHBlci5zZXREYXRhVGFibGUodGhpcy5kYXRhVGFibGUpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldENoYXJ0VHlwZSh0aGlzLmNoYXJ0RGF0YS5jaGFydFR5cGUpO1xyXG4gICAgdGhpcy53cmFwcGVyLnNldE9wdGlvbnModGhpcy5jaGFydERhdGEub3B0aW9ucyk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0RGF0YVNvdXJjZVVybCh0aGlzLmNoYXJ0RGF0YS5kYXRhU291cmNlVXJsKTtcclxuICAgIHRoaXMud3JhcHBlci5zZXRRdWVyeSh0aGlzLmNoYXJ0RGF0YS5xdWVyeSk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0UmVmcmVzaEludGVydmFsKHRoaXMuY2hhcnREYXRhLnJlZnJlc2hJbnRlcnZhbCk7XHJcbiAgICB0aGlzLndyYXBwZXIuc2V0Vmlldyh0aGlzLmNoYXJ0RGF0YS52aWV3KTtcclxuXHJcbiAgICB0aGlzLnJlbW92ZUNoYXJ0RXZlbnRzKCk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudHMoKTtcclxuXHJcbiAgICBpZiAodGhpcy5mb3JtYXR0ZXIpIHtcclxuICAgICAgdGhpcy5mb3JtYXREYXRhKHRoaXMuZGF0YVRhYmxlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLndyYXBwZXIuZHJhdyh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XHJcbiAgfVxyXG5cclxuICBwcm90ZWN0ZWQgZm9ybWF0RGF0YShkYXRhVGFibGU6IGdvb2dsZS52aXN1YWxpemF0aW9uLkRhdGFUYWJsZSkge1xyXG4gICAgaWYgKHRoaXMuZm9ybWF0dGVyIGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgdGhpcy5mb3JtYXR0ZXIuZm9yRWFjaCh2YWx1ZSA9PiB7XHJcbiAgICAgICAgdmFsdWUuZm9ybWF0dGVyLmZvcm1hdChkYXRhVGFibGUsIHZhbHVlLmNvbEluZGV4KTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGFUYWJsZS5nZXROdW1iZXJPZkNvbHVtbnMoKTsgaSsrKSB7XHJcbiAgICAgICAgdGhpcy5mb3JtYXR0ZXIuZm9ybWF0KGRhdGFUYWJsZSwgaSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWRkUmVzaXplTGlzdGVuZXIoKSB7XHJcbiAgICBpZiAodGhpcy5keW5hbWljUmVzaXplKSB7XHJcbiAgICAgIGZyb21FdmVudCh3aW5kb3csICdyZXNpemUnKVxyXG4gICAgICAgIC5waXBlKGRlYm91bmNlVGltZSgxMDApKVxyXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5uZ09uQ2hhbmdlcygpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSByZW1vdmVDaGFydEV2ZW50cygpIHtcclxuICAgIGdvb2dsZS52aXN1YWxpemF0aW9uLmV2ZW50cy5yZW1vdmVBbGxMaXN0ZW5lcnModGhpcy53cmFwcGVyKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50cygpIHtcclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ3JlYWR5JywgKCkgPT4ge1xyXG4gICAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIuZ2V0Q2hhcnQoKSwgJ29ubW91c2VvdmVyJywgZXZlbnQgPT4gdGhpcy5tb3VzZWVudGVyLmVtaXQoZXZlbnQpKTtcclxuICAgICAgdGhpcy5yZWdpc3RlckNoYXJ0RXZlbnQodGhpcy53cmFwcGVyLmdldENoYXJ0KCksICdvbm1vdXNlb3V0JywgZXZlbnQgPT4gdGhpcy5tb3VzZWxlYXZlLmVtaXQoZXZlbnQpKTtcclxuXHJcbiAgICAgIHRoaXMucmVhZHkuZW1pdCgnQ2hhcnQgUmVhZHknKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMucmVnaXN0ZXJDaGFydEV2ZW50KHRoaXMud3JhcHBlciwgJ2Vycm9yJywgZXJyb3IgPT4gdGhpcy5lcnJvci5lbWl0KGVycm9yKSk7XHJcbiAgICB0aGlzLnJlZ2lzdGVyQ2hhcnRFdmVudCh0aGlzLndyYXBwZXIsICdzZWxlY3QnLCAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMud3JhcHBlci5nZXRDaGFydCgpLmdldFNlbGVjdGlvbigpO1xyXG4gICAgICB0aGlzLnNlbGVjdC5lbWl0KHNlbGVjdGlvbik7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVnaXN0ZXJDaGFydEV2ZW50KG9iamVjdDogYW55LCBldmVudE5hbWU6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICBnb29nbGUudmlzdWFsaXphdGlvbi5ldmVudHMuYWRkTGlzdGVuZXIob2JqZWN0LCBldmVudE5hbWUsIGNhbGxiYWNrKTtcclxuICB9XHJcbn1cclxuIl19