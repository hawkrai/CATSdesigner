import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular8';
  public white: boolean;
  public black: boolean;

  public ngOnInit(): void {
    document.body.style.overflowY = "auto";
    if (localStorage.getItem("theme") === "white") {
      document.body.style.backgroundColor = '#f5f5f5';
      this.white = true;
    } else {
      document.body.style.backgroundColor = '#131313';
      document.body.style.color = 'white';
      this.black = true;
    }
  }
}
