import {Component, OnInit, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {

  subjectId: string;
  menuElements;
  pageName: string;

  @ViewChild('drawer', { static: false })
  drawer: MatSidenav;
  constructor() { }

  ngOnInit() {
    const urlArray =  window.location.pathname.split('/');
    this.subjectId = urlArray[1];

    this.menuElements = [
      { name: 'Новости', tab: '/news', icon: 'library_books'},
      { name: 'Лекции', tab: '/lectures', icon: 'account_balance'},
      { name: 'Лабораторные работы', tab: '/labs', icon: 'work_outline'},
      { name: 'Файлы', tab: '/files', icon: 'attachment'},
    ];

    this.pageName = '/' + urlArray[2];

  }

  selectedTab(tab) {
    this.pageName = tab.href;
  }

}
