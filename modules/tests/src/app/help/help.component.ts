import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less'],
})
export class HelpComponent {
  @Input() message: string
  @Input() action: string
  @Input() placement = 'top-left'
}
