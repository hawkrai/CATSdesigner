import { Component, Inject } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { CoreGroup } from 'src/app/models/core-group.model'
import { TranslatePipe } from 'educats-translate'

interface DialogData {
  id?: number
  name: string
  groups: CoreGroup[]
  selectedGroups: (number | CoreGroup)[]
  edit: boolean
}

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.less'],
})
export class AddProjectDialogComponent {
  nameControl: FormControl

  groups: CoreGroup[] = []

  constructor(
    public dialogRef: MatDialogRef<AddProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public translatePipe: TranslatePipe
  ) {
    this.nameControl = new FormControl(this.data.name, [
      Validators.minLength(3),
      Validators.maxLength(255),
      Validators.required,
      this.noWhitespaceValidator,
    ])
    const selectedIds: number[] = this.data.selectedGroups.map((item) => {
      if (typeof item === 'number') {
        return item
      }
      return Number(item.GroupId)
    })
    this.data.selectedGroups = this.data.groups.filter((g) =>
      selectedIds.includes(Number(g.GroupId))
    )
    this.groups = this.data.groups.filter(
      (g) => !selectedIds.includes(Number(g.GroupId))
    )
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }

  move(i: number, origin: CoreGroup[], dest: CoreGroup[]) {
    const group = origin.splice(i, 1)[0]
    dest.push(group)
  }

  includeAll() {
    this.data.selectedGroups = this.data.groups.slice()
    this.groups = []
  }

  includeNone() {
    this.data.selectedGroups = []
    this.groups = this.data.groups.slice()
  }

  trackByFn(index: number, item: CoreGroup) {
    return Number(item.GroupId)
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0
    return isWhitespace ? { whitespace: true } : null
  }
}
