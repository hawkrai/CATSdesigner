import { OnInit, ElementRef, OnChanges } from '@angular/core';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
import { RawChartComponent } from '../raw-chart/raw-chart.component';
import { Role } from '../models/role.model';
export declare class GoogleChartComponent extends RawChartComponent implements OnInit, OnChanges {
    data: Array<Array<string | number>>;
    columnNames: Array<string>;
    roles: Array<Role>;
    title: string;
    width: number;
    height: number;
    options: any;
    type: string;
    constructor(element: ElementRef, loaderService: ScriptLoaderService);
    ngOnInit(): void;
    ngOnChanges(): void;
    protected parseOptions(): any;
    protected createChart(): void;
    protected getDataTable(): Array<any>;
    private parseRoles;
}
