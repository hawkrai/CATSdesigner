/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
/// <reference types="google.visualization"/>
/// <reference types="google.visualization"/>
import { Component, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { RawChartComponent } from '../raw-chart/raw-chart.component';
var GoogleChartComponent = /** @class */ (function (_super) {
    tslib_1.__extends(GoogleChartComponent, _super);
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
        return tslib_1.__assign({ title: this.title, width: this.width, height: this.height }, this.options);
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
            return tslib_1.__spread([columns], this.data);
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
                        for (var copyRoles_2 = tslib_1.__values(copyRoles_1), copyRoles_2_1 = copyRoles_2.next(); !copyRoles_2_1.done; copyRoles_2_1 = copyRoles_2.next()) {
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
export { GoogleChartComponent };
if (false) {
    /** @type {?} */
    GoogleChartComponent.prototype.data;
    /** @type {?} */
    GoogleChartComponent.prototype.columnNames;
    /** @type {?} */
    GoogleChartComponent.prototype.roles;
    /** @type {?} */
    GoogleChartComponent.prototype.title;
    /** @type {?} */
    GoogleChartComponent.prototype.width;
    /** @type {?} */
    GoogleChartComponent.prototype.height;
    /** @type {?} */
    GoogleChartComponent.prototype.options;
    /** @type {?} */
    GoogleChartComponent.prototype.type;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9nb29nbGUtY2hhcnQvZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDZDQUE2Qzs7QUFFN0MsT0FBTyxFQUFFLFNBQVMsRUFBVSxVQUFVLEVBQUUsS0FBSyxFQUFFLHVCQUF1QixFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRXpHLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQzdFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGtDQUFrQyxDQUFDO0FBR3JFO0lBUTBDLGdEQUFpQjtJQXlCekQsOEJBQVksT0FBbUIsRUFBRSxhQUFrQztRQUFuRSxZQUNFLGtCQUFNLE9BQU8sRUFBRSxhQUFhLENBQUMsU0FDOUI7UUFuQkQsV0FBSyxHQUFnQixJQUFJLEtBQUssRUFBRSxDQUFDO1FBTWpDLFdBQUssR0FBVyxTQUFTLENBQUM7UUFHMUIsWUFBTSxHQUFXLFNBQVMsQ0FBQztRQUczQixhQUFPLEdBQVEsRUFBRSxDQUFDOztJQU9sQixDQUFDOzs7O0lBRUQsdUNBQVE7OztJQUFSO1FBQUEsaUJBZUM7UUFkQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM1RTtRQUNELElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNyQixDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUzs7O1FBQUM7WUFDbkMs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SyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUU7Z0NBQ2hDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsQ0FBQzs2QkFDbkI7eUJBQ0Y7Ozs7Ozs7OztpQkFDRjtxQkFBTTtvQkFDTCxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3JDO1lBQ0gsQ0FBQyxFQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sb0JBQW9CLENBQUM7SUFDOUIsQ0FBQzs7Z0JBbklGLFNBQVMsU0FBQzs7b0JBRVQsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSxFQUFFO29CQUVaLFFBQVEsRUFBRSxjQUFjO29CQUN4QixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTs2QkFGdEMsK0NBQStDO2lCQUd6RDs7OztnQkFiMkIsVUFBVTtnQkFFN0IsbUJBQW1COzs7dUJBYXpCLEtBQUs7OEJBR0wsS0FBSzt3QkFHTCxLQUFLO3dCQUdMLEtBQUs7d0JBR0wsS0FBSzt5QkFHTCxLQUFLOzBCQUdMLEtBQUs7dUJBR0wsS0FBSzs7SUFzR1IsMkJBQUM7Q0FBQSxBQXBJRCxDQVEwQyxpQkFBaUIsR0E0SDFEO1NBNUhZLG9CQUFvQjs7O0lBQy9CLG9DQUNvQzs7SUFFcEMsMkNBQzJCOztJQUUzQixxQ0FDaUM7O0lBRWpDLHFDQUNjOztJQUVkLHFDQUMwQjs7SUFFMUIsc0NBQzJCOztJQUUzQix1Q0FDa0I7O0lBRWxCLG9DQUNhIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUudmlzdWFsaXphdGlvblwiLz5cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBFbGVtZW50UmVmLCBJbnB1dCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIE9uQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4uL3NjcmlwdC1sb2FkZXIvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmF3Q2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9yYXctY2hhcnQvcmF3LWNoYXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFJvbGUgfSBmcm9tICcuLi9tb2RlbHMvcm9sZS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXHJcbiAgc2VsZWN0b3I6ICdnb29nbGUtY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxuICBzdHlsZXM6IFsnOmhvc3QgeyB3aWR0aDogZml0LWNvbnRlbnQ7IGRpc3BsYXk6IGJsb2NrOyB9J10sXHJcbiAgZXhwb3J0QXM6ICdnb29nbGUtY2hhcnQnLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHb29nbGVDaGFydENvbXBvbmVudCBleHRlbmRzIFJhd0NoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpXHJcbiAgZGF0YTogQXJyYXk8QXJyYXk8c3RyaW5nIHwgbnVtYmVyPj47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29sdW1uTmFtZXM6IEFycmF5PHN0cmluZz47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcm9sZXM6IEFycmF5PFJvbGU+ID0gbmV3IEFycmF5KCk7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdGl0bGU6IHN0cmluZztcclxuXHJcbiAgQElucHV0KClcclxuICB3aWR0aDogbnVtYmVyID0gdW5kZWZpbmVkO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGhlaWdodDogbnVtYmVyID0gdW5kZWZpbmVkO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG9wdGlvbnM6IGFueSA9IHt9O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHR5cGU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZiwgbG9hZGVyU2VydmljZTogU2NyaXB0TG9hZGVyU2VydmljZSkge1xyXG4gICAgc3VwZXIoZWxlbWVudCwgbG9hZGVyU2VydmljZSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLnR5cGUgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgY3JlYXRlIGEgR29vZ2xlIENoYXJ0IHdpdGhvdXQgc3BlY2lmeWluZyBhIHR5cGUhJyk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kYXRhID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGNyZWF0ZSBhIEdvb2dsZSBDaGFydCB3aXRob3V0IGRhdGEhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGFydERhdGEgPSB7XHJcbiAgICAgIGNoYXJ0VHlwZTogdGhpcy50eXBlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5vblJlYWR5LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoKSB7XHJcbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XHJcbiAgICAgIHRoaXMuY2hhcnREYXRhID0ge1xyXG4gICAgICAgIGNoYXJ0VHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgIGRhdGFUYWJsZTogdGhpcy5nZXREYXRhVGFibGUoKSxcclxuICAgICAgICBvcHRpb25zOiB0aGlzLnBhcnNlT3B0aW9ucygpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc3VwZXIubmdPbkNoYW5nZXMoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBwYXJzZU9wdGlvbnMoKTogYW55IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxyXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgLi4udGhpcy5vcHRpb25zXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGNyZWF0ZUNoYXJ0KCkge1xyXG4gICAgdGhpcy5sb2FkTmVlZGVkUGFja2FnZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNoYXJ0RGF0YSA9IHtcclxuICAgICAgICBjaGFydFR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ2V0RGF0YVRhYmxlKCksXHJcbiAgICAgICAgb3B0aW9uczogdGhpcy5wYXJzZU9wdGlvbnMoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcigpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXREYXRhVGFibGUoKTogQXJyYXk8YW55PiB7XHJcbiAgICBpZiAodGhpcy5jb2x1bW5OYW1lcykge1xyXG4gICAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wYXJzZVJvbGVzKHRoaXMuY29sdW1uTmFtZXMpO1xyXG4gICAgICB0aGlzLmZpcnN0Um93SXNEYXRhID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiBbY29sdW1ucywgLi4udGhpcy5kYXRhXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZmlyc3RSb3dJc0RhdGEgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZVJvbGVzKGNvbHVtbk5hbWVzOiBhbnlbXSk6IGFueVtdIHtcclxuICAgIGNvbnN0IGNvbHVtbk5hbWVzV2l0aFJvbGVzID0gY29sdW1uTmFtZXMuc2xpY2UoKTtcclxuICAgIGlmICh0aGlzLnJvbGVzKSB7XHJcbiAgICAgIC8vIFJvbGVzIG11c3QgYmUgY29waWVkIHRvIGF2b2lkIG1vZGlmeWluZyB0aGUgaW5kZXggZXZlcnl0aW1lIHRoZXJlJ3MgYSBjaGFuZ2UgZnJvbSBuZ09uQ2hhbmdlcy5cclxuICAgICAgY29uc3QgY29weVJvbGVzID0gdGhpcy5yb2xlcy5tYXAocm9sZSA9PiBPYmplY3QuYXNzaWduKHt9LCByb2xlKSk7XHJcbiAgICAgIGNvcHlSb2xlcy5mb3JFYWNoKHJvbGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJvbGVEYXRhOiBSb2xlID0ge1xyXG4gICAgICAgICAgdHlwZTogcm9sZS50eXBlLFxyXG4gICAgICAgICAgcm9sZTogcm9sZS5yb2xlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAocm9sZS5wKSB7XHJcbiAgICAgICAgICByb2xlRGF0YS5wID0gcm9sZS5wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm9sZS5pbmRleCAhPSBudWxsKSB7XHJcbiAgICAgICAgICBjb2x1bW5OYW1lc1dpdGhSb2xlcy5zcGxpY2Uocm9sZS5pbmRleCArIDEsIDAsIHJvbGVEYXRhKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IG90aGVyUm9sZSBvZiBjb3B5Um9sZXMpIHtcclxuICAgICAgICAgICAgaWYgKG90aGVyUm9sZSA9PT0gcm9sZSkge1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3RoZXJSb2xlLmluZGV4ID4gcm9sZS5pbmRleCkge1xyXG4gICAgICAgICAgICAgIG90aGVyUm9sZS5pbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbHVtbk5hbWVzV2l0aFJvbGVzLnB1c2gocm9sZURhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbHVtbk5hbWVzV2l0aFJvbGVzO1xyXG4gIH1cclxufVxyXG4iXX0=