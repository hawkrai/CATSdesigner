import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular8';

  public ngOnInit(): void {
    document.body.style.overflowY = "auto";
  }
}
