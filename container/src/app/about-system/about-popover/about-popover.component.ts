import { Component } from '@angular/core'
import { MatDialogRef } from '@angular/material/dialog'
import { AuthenticationService } from '../../core/services/auth.service'

@Component({
  selector: 'about-popover',
  templateUrl: './about-popover.component.html',
  styleUrls: ['./about-popover.component.less'],
})
export class AboutSystemPopoverComponent {
  year = new Date().getFullYear()
  public isAdmin: boolean

  constructor(private dialogRef: MatDialogRef<AboutSystemPopoverComponent>, private autService: AuthenticationService) {
    dialogRef.disableClose = true

  }

  ngOnInit(): void {
    this.isAdmin = false
    if (this.autService.currentUserValue != undefined) {
      const authRole = this.autService.currentUserValue.role
      this.isAdmin = authRole === 'admin'
    }
  }

  onClose() {
    this.dialogRef.close()
  }
}
