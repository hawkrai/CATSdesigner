/// <reference types="google.visualization" />
import { EventEmitter, ElementRef, OnInit, OnChanges, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChartErrorEvent, ChartEvent } from '../models/events.model';
import { ScriptLoaderService } from '../script-loader/script-loader.service';
export declare class RawChartComponent implements OnInit, OnChanges, AfterViewInit {
    protected element: ElementRef;
    protected loaderService: ScriptLoaderService;
    chartData: google.visualization.ChartSpecs;
    formatter: google.visualization.DefaultFormatter | Array<{
        formatter: google.visualization.DefaultFormatter;
        colIndex: number;
    }>;
    dynamicResize: boolean;
    firstRowIsData: boolean;
    error: EventEmitter<ChartErrorEvent>;
    ready: EventEmitter<{}>;
    select: EventEmitter<ChartEvent>;
    mouseenter: EventEmitter<ChartEvent>;
    mouseleave: EventEmitter<ChartEvent>;
    wrapper: google.visualization.ChartWrapper;
    private dataTable;
    constructor(element: ElementRef, loaderService: ScriptLoaderService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(): void;
    getChartElement(): HTMLElement;
    protected createChart(): void;
    protected loadNeededPackages(): Observable<void>;
    protected updateChart(): void;
    protected formatData(dataTable: google.visualization.DataTable): void;
    private addResizeListener;
    private removeChartEvents;
    private registerChartEvents;
    private registerChartEvent;
}
