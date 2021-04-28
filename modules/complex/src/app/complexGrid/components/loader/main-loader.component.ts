import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material';

@Component({
  selector: 'main-app-loader',
  templateUrl: './main-loader.component.html',
  styleUrls: ['./main-loader.component.less']
})
export class MainLoaderComponent {

  @Input() diameter = 20;
  @Input() color: ThemePalette = 'primary';
}
