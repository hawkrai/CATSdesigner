import { Component, OnInit } from '@angular/core'

@Component({
  templateUrl: './student-manual.component.html',
  styleUrls: ['./student-manual.component.less'],
  selector: 'app-student-manual',
})
export class StudentManualComponent implements OnInit {
  language: string

  ngOnInit() {
    const language = localStorage.getItem('locale') || 'ru'

    this.language = language
  }
}
