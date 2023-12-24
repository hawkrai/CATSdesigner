import { Component, OnInit } from '@angular/core'

@Component({
  templateUrl: './lector-manual.component.html',
  styleUrls: ['./lector-manual.component.less'],
  selector: 'app-lector-manual',
})
export class LectorManualComponent implements OnInit {
  language: string

  ngOnInit() {
    const language = localStorage.getItem('locale') || 'ru'

    this.language = language
  }
}
