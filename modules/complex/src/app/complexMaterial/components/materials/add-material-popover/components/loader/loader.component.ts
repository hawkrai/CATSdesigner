import { Component, Input, OnInit } from '@angular/core'
import { ThemePalette } from '@angular/material'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less'],
})
export class LoaderComponent {
  @Input() diameter = 20
  @Input() color: ThemePalette = 'primary'
}
