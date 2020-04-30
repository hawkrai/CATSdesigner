/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/// <reference types="google.visualization"/>
/// <reference types="google.visualization"/>
import { Component, ElementRef, Input, ChangeDetectionStrategy } from '@angular/core';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { RawChartComponent } from '../raw-chart/raw-chart.component';
export class GoogleChartComponent extends RawChartComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXItZ29vZ2xlLWNoYXJ0cy8iLCJzb3VyY2VzIjpbImxpYi9nb29nbGUtY2hhcnQvZ29vZ2xlLWNoYXJ0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsNkNBQTZDOztBQUU3QyxPQUFPLEVBQUUsU0FBUyxFQUFVLFVBQVUsRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQWEsTUFBTSxlQUFlLENBQUM7QUFFekcsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sd0NBQXdDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sa0NBQWtDLENBQUM7QUFXckUsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGlCQUFpQjs7Ozs7SUF5QnpELFlBQVksT0FBbUIsRUFBRSxhQUFrQztRQUNqRSxLQUFLLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBbEJoQyxVQUFLLEdBQWdCLElBQUksS0FBSyxFQUFFLENBQUM7UUFNakMsVUFBSyxHQUFXLFNBQVMsQ0FBQztRQUcxQixXQUFNLEdBQVcsU0FBUyxDQUFDO1FBRzNCLFlBQU8sR0FBUSxFQUFFLENBQUM7SUFPbEIsQ0FBQzs7OztJQUVELFFBQVE7UUFDTixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxFQUFFO1lBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMseURBQXlELENBQUMsQ0FBQztTQUM1RTtRQUNELElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDckIsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO1NBQy9EO1FBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRztZQUNmLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSTtTQUNyQixDQUFDO1FBRUYsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsU0FBUzs7O1FBQUMsR0FBRyxFQUFF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QUNGO2lCQUNGO3FCQUFNO29CQUNMLG9CQUFvQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDckM7WUFDSCxDQUFDLEVBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxvQkFBb0IsQ0FBQztJQUM5QixDQUFDOzs7WUFuSUYsU0FBUyxTQUFDOztnQkFFVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFLEVBQUU7Z0JBRVosUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO3lCQUZ0QywrQ0FBK0M7YUFHekQ7Ozs7WUFiMkIsVUFBVTtZQUU3QixtQkFBbUI7OzttQkFhekIsS0FBSzswQkFHTCxLQUFLO29CQUdMLEtBQUs7b0JBR0wsS0FBSztvQkFHTCxLQUFLO3FCQUdMLEtBQUs7c0JBR0wsS0FBSzttQkFHTCxLQUFLOzs7O0lBckJOLG9DQUNvQzs7SUFFcEMsMkNBQzJCOztJQUUzQixxQ0FDaUM7O0lBRWpDLHFDQUNjOztJQUVkLHFDQUMwQjs7SUFFMUIsc0NBQzJCOztJQUUzQix1Q0FDa0I7O0lBRWxCLG9DQUNhIiwic291cmNlc0NvbnRlbnQiOlsiLy8vIDxyZWZlcmVuY2UgdHlwZXM9XCJnb29nbGUudmlzdWFsaXphdGlvblwiLz5cclxuXHJcbmltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBFbGVtZW50UmVmLCBJbnB1dCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIE9uQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgU2NyaXB0TG9hZGVyU2VydmljZSB9IGZyb20gJy4uL3NjcmlwdC1sb2FkZXIvc2NyaXB0LWxvYWRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUmF3Q2hhcnRDb21wb25lbnQgfSBmcm9tICcuLi9yYXctY2hhcnQvcmF3LWNoYXJ0LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFJvbGUgfSBmcm9tICcuLi9tb2RlbHMvcm9sZS5tb2RlbCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXHJcbiAgc2VsZWN0b3I6ICdnb29nbGUtY2hhcnQnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxuICBzdHlsZXM6IFsnOmhvc3QgeyB3aWR0aDogZml0LWNvbnRlbnQ7IGRpc3BsYXk6IGJsb2NrOyB9J10sXHJcbiAgZXhwb3J0QXM6ICdnb29nbGUtY2hhcnQnLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBHb29nbGVDaGFydENvbXBvbmVudCBleHRlbmRzIFJhd0NoYXJ0Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG4gIEBJbnB1dCgpXHJcbiAgZGF0YTogQXJyYXk8QXJyYXk8c3RyaW5nIHwgbnVtYmVyPj47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgY29sdW1uTmFtZXM6IEFycmF5PHN0cmluZz47XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgcm9sZXM6IEFycmF5PFJvbGU+ID0gbmV3IEFycmF5KCk7XHJcblxyXG4gIEBJbnB1dCgpXHJcbiAgdGl0bGU6IHN0cmluZztcclxuXHJcbiAgQElucHV0KClcclxuICB3aWR0aDogbnVtYmVyID0gdW5kZWZpbmVkO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGhlaWdodDogbnVtYmVyID0gdW5kZWZpbmVkO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIG9wdGlvbnM6IGFueSA9IHt9O1xyXG5cclxuICBASW5wdXQoKVxyXG4gIHR5cGU6IHN0cmluZztcclxuXHJcbiAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudFJlZiwgbG9hZGVyU2VydmljZTogU2NyaXB0TG9hZGVyU2VydmljZSkge1xyXG4gICAgc3VwZXIoZWxlbWVudCwgbG9hZGVyU2VydmljZSk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLnR5cGUgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhblxcJ3QgY3JlYXRlIGEgR29vZ2xlIENoYXJ0IHdpdGhvdXQgc3BlY2lmeWluZyBhIHR5cGUhJyk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5kYXRhID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5cXCd0IGNyZWF0ZSBhIEdvb2dsZSBDaGFydCB3aXRob3V0IGRhdGEhJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jaGFydERhdGEgPSB7XHJcbiAgICAgIGNoYXJ0VHlwZTogdGhpcy50eXBlXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubG9hZGVyU2VydmljZS5vblJlYWR5LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgIHRoaXMuY3JlYXRlQ2hhcnQoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoKSB7XHJcbiAgICBpZiAodGhpcy53cmFwcGVyKSB7XHJcbiAgICAgIHRoaXMuY2hhcnREYXRhID0ge1xyXG4gICAgICAgIGNoYXJ0VHlwZTogdGhpcy50eXBlLFxyXG4gICAgICAgIGRhdGFUYWJsZTogdGhpcy5nZXREYXRhVGFibGUoKSxcclxuICAgICAgICBvcHRpb25zOiB0aGlzLnBhcnNlT3B0aW9ucygpXHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc3VwZXIubmdPbkNoYW5nZXMoKTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBwYXJzZU9wdGlvbnMoKTogYW55IHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxyXG4gICAgICB3aWR0aDogdGhpcy53aWR0aCxcclxuICAgICAgaGVpZ2h0OiB0aGlzLmhlaWdodCxcclxuICAgICAgLi4udGhpcy5vcHRpb25zXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIGNyZWF0ZUNoYXJ0KCkge1xyXG4gICAgdGhpcy5sb2FkTmVlZGVkUGFja2FnZXMoKS5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICB0aGlzLmNoYXJ0RGF0YSA9IHtcclxuICAgICAgICBjaGFydFR5cGU6IHRoaXMudHlwZSxcclxuICAgICAgICBkYXRhVGFibGU6IHRoaXMuZ2V0RGF0YVRhYmxlKCksXHJcbiAgICAgICAgb3B0aW9uczogdGhpcy5wYXJzZU9wdGlvbnMoKVxyXG4gICAgICB9O1xyXG5cclxuICAgICAgdGhpcy53cmFwcGVyID0gbmV3IGdvb2dsZS52aXN1YWxpemF0aW9uLkNoYXJ0V3JhcHBlcigpO1xyXG4gICAgICB0aGlzLnVwZGF0ZUNoYXJ0KCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXREYXRhVGFibGUoKTogQXJyYXk8YW55PiB7XHJcbiAgICBpZiAodGhpcy5jb2x1bW5OYW1lcykge1xyXG4gICAgICBjb25zdCBjb2x1bW5zID0gdGhpcy5wYXJzZVJvbGVzKHRoaXMuY29sdW1uTmFtZXMpO1xyXG4gICAgICB0aGlzLmZpcnN0Um93SXNEYXRhID0gZmFsc2U7XHJcbiAgICAgIHJldHVybiBbY29sdW1ucywgLi4udGhpcy5kYXRhXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZmlyc3RSb3dJc0RhdGEgPSB0cnVlO1xyXG4gICAgICByZXR1cm4gdGhpcy5kYXRhO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBwYXJzZVJvbGVzKGNvbHVtbk5hbWVzOiBhbnlbXSk6IGFueVtdIHtcclxuICAgIGNvbnN0IGNvbHVtbk5hbWVzV2l0aFJvbGVzID0gY29sdW1uTmFtZXMuc2xpY2UoKTtcclxuICAgIGlmICh0aGlzLnJvbGVzKSB7XHJcbiAgICAgIC8vIFJvbGVzIG11c3QgYmUgY29waWVkIHRvIGF2b2lkIG1vZGlmeWluZyB0aGUgaW5kZXggZXZlcnl0aW1lIHRoZXJlJ3MgYSBjaGFuZ2UgZnJvbSBuZ09uQ2hhbmdlcy5cclxuICAgICAgY29uc3QgY29weVJvbGVzID0gdGhpcy5yb2xlcy5tYXAocm9sZSA9PiBPYmplY3QuYXNzaWduKHt9LCByb2xlKSk7XHJcbiAgICAgIGNvcHlSb2xlcy5mb3JFYWNoKHJvbGUgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJvbGVEYXRhOiBSb2xlID0ge1xyXG4gICAgICAgICAgdHlwZTogcm9sZS50eXBlLFxyXG4gICAgICAgICAgcm9sZTogcm9sZS5yb2xlXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAocm9sZS5wKSB7XHJcbiAgICAgICAgICByb2xlRGF0YS5wID0gcm9sZS5wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAocm9sZS5pbmRleCAhPSBudWxsKSB7XHJcbiAgICAgICAgICBjb2x1bW5OYW1lc1dpdGhSb2xlcy5zcGxpY2Uocm9sZS5pbmRleCArIDEsIDAsIHJvbGVEYXRhKTtcclxuXHJcbiAgICAgICAgICBmb3IgKGNvbnN0IG90aGVyUm9sZSBvZiBjb3B5Um9sZXMpIHtcclxuICAgICAgICAgICAgaWYgKG90aGVyUm9sZSA9PT0gcm9sZSkge1xyXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAob3RoZXJSb2xlLmluZGV4ID4gcm9sZS5pbmRleCkge1xyXG4gICAgICAgICAgICAgIG90aGVyUm9sZS5pbmRleCsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbHVtbk5hbWVzV2l0aFJvbGVzLnB1c2gocm9sZURhdGEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbHVtbk5hbWVzV2l0aFJvbGVzO1xyXG4gIH1cclxufVxyXG4iXX0=