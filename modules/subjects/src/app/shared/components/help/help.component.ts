import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  @Input() message: string;
  @Input() action: string;
  constructor(
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  showHelp(): void {
    this.snackBar.open(this.message, this.action, {
      duration: 10000,
      panelClass: ['help-snackbar']
    })
  }
}
