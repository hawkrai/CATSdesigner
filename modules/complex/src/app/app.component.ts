import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'complex';

  public ngOnInit(): void {
    document.body.style.overflowY = "auto";
  }
}
