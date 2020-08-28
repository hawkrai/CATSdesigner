import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewChild } from '@angular/core';
import * as d3 from 'd3';

import { AngularD3TreeLibService } from 'angular-d3-tree';

interface ComplexNode {
  name: string;
  id: number;
  children?: ComplexNode[];
}

const TREE_DATA: ComplexNode[] = [
  {
    name: 'Теоретический раздел',
    id: 0,
    children: [
      {
        name: 'Роль и место тестирования в ЖЦ разработки ПО',
        id: 1,
        children: [
          { name: 'Определение термина тестирования', id: 4 },
          { name: 'Тестирование в ЖЦ разработки ПО', id: 5 },
          { name: 'Виды тестирования ПО', id: 6 },
          { name: 'Смежные вопросы тестирования', id: 7 },
        ]
      },
      {
        name: 'Разработка и тестирование требований к программному продукту',
        id: 2,
        children: [
          { name: 'Этапы разработки требований', id: 8 },
          { name: 'Категории требований', id: 9 }
        ]
      },
      {
        name: 'Модульное тестирование',
        id: 3,
        children: [
          { name: 'Модульное тестирование и его задачи', id: 10 },
          { name: 'Обзоры программного кода', id: 11 },
          { name: 'Принципы тестирования структуры программных модулей', id: 12 },
          { name: 'Способы тестирования взаимодействия', id: 13 },
          { name: 'Стратегии выполнения пошагового тестирования', id: 14 },
          { name: 'Особенности объектно-ориентированного тестирования', id: 15 },
        ]
      },
    ]
  },
];

const complexTree = {
  "result": [
    { "id": "0", "description": "Теоретический раздел" },
    { "id": "1", "description": "Роль и место тестирования в ЖЦ разработки ПО", "parent": "0" },
    { "id": "2", "description": "Разработка и тестирование требований к программному продукту", "parent": "0" },
    { "id": "3", "description": "Модульное тестирование", "parent": "0" },
    { "id": "4", "description": "Определение термина тестирования", "parent": "1" },
    { "id": "5", "description": "Тестирование в ЖЦ разработки ПО", "parent": "1" },
    { "id": "6", "description": "Виды тестирования ПО", "parent": "1" },
    { "id": "7", "description": "Смежные вопросы тестирования", "parent": "1" },
    { "id": "8", "description": "Этапы разработки требований", "parent": "2" },
    { "id": "9", "description": "Категории требований", "parent": "2" },
    { "id": "10", "description": "Модульное тестирование и его задачи", "parent": "3" },
    { "id": "11", "description": "Обзоры программного кода", "parent": "3" },
    { "id": "12", "description": "Принципы тестирования структуры программных модулей", "parent": "3" },
    { "id": "13", "description": "Способы тестирования взаимодействия", "parent": "3" },
    { "id": "14", "description": "Стратегии выполнения пошагового тестирования", "parent": "3" },
    { "id": "15", "description": "Особенности объектно-ориентированного тестирования", "parent": "3" },
  ]
};

@Component({
  selector: 'map-popover',
  templateUrl: './map-popover.component.html',
  styleUrls: ['./map-popover.component.less']
})

export class MapPopoverComponent implements OnInit{

  chartData: any[];

  constructor(public dialogRef: MatDialogRef<MapPopoverComponent>,
    private treeService: AngularD3TreeLibService) {
    this.chartData = complexTree.result;  
       
  }

  ngOnInit() {    
    console.info(this.treeService);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectedNode: any;

  nodeUpdated(node: any) {
    console.info("app detected node change");
  }
  nodeSelected(node: any) {
    console.info("app detected node selected", node);
    this.selectedNode = node;
  }
}

