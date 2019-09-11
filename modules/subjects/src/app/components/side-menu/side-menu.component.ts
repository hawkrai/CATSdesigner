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
    const urlArray =  window.location.pathname.split('/');
    this.subjectId = urlArray[1];

    this.menuElements = [
      { name: 'Новости', tab: '/news'},
      { name: 'Лекции', tab: '/lectures'},
      { name: 'Лабораторные работы', tab: '/'},
      { name: 'Тестирование знаний', tab: '/'},
    ];

    this.pageName = '/' + urlArray[2];

  }

  selectedTab(tab) {
    this.pageName = tab.href;
  }

}
