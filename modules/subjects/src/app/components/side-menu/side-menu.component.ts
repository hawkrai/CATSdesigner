import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {

  menuElements;
  pageName;

  constructor() { }

  ngOnInit() {
    this.pageName = window.location.pathname;

    this.menuElements = [
      { name: 'Новости', tab: '/news'},
      { name: 'Лекции', tab: '/lectures'},
      { name: 'Лабораторные работы', tab: '/labs'},
      { name: 'Файлы', tab: '/'},
    ];

  }

  selectedTab(menuElement) {
    this.pageName = menuElement.tab;
  }

}
