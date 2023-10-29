import { Component, OnInit, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'

@Component({
  selector: 'app-delete-person',
  templateUrl: './delete-person.component.html',
  styleUrls: ['./delete-person.component.css'],
})
export class DeleteItemComponent implements OnInit {
  constructor(public dialogRef: MatDialogRef<DeleteItemComponent>) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close()
  }
}
