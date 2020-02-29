import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {

  subjectId: string;
  menuElements;
  pageName;

  constructor() { }

  ngOnInit() {
    const urlArray = window.location.pathname.split('/');
    this.subjectId = urlArray[1];

    this.menuElements = [
      { name: 'Объявления', tab: '/news' },
      { name: 'Темы курсовых проектов (работ)', tab: '/projects' },
      { name: 'Лист задания', tab: '/taskSheet' },
      { name: 'График процентовки', tab: '/percentages' },
      { name: 'Результаты процентовки', tab: '/percentageResults' },
      { name: 'Статистика посещения консультаций', tab: '/visitStats' },
      { name: 'Защита курсового проекта (работы)', tab: '/uploadProject' }
    ];

    this.pageName = '/' + urlArray[2];

  }

  selectedTab(tab) {
    this.pageName = tab.href;
  }

}
