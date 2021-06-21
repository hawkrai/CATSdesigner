import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { HelpPopoverComponent} from './help-popover/help-popover.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  @Input() message: string;
  @Input() action: string;
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  showHelp(): void{

      const dialogRef = this.dialog.open(HelpPopoverComponent, {
        data: {message: this.message, action: this.action},
        hasBackdrop: true,
        disableClose: true,
        backdropClass: 'backdrop-help',
        panelClass: 'help-popover'
      });
  
      dialogRef.afterClosed().subscribe(result => {
      });

}

}
