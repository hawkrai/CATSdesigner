import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from '../../models/dialog-data.model';
import {LabsService} from '../../services/labs/labs.service';

@Component({
  selector: 'app-delete-popover',
  templateUrl: 'check-plagiarism-popover.component.html',
  styleUrls: ['./check-plagiarism-popover.component.less']
})
export class CheckPlagiarismPopoverComponent {

  labelPosition: '0' | '1' = '0';
  percent = 50;

  result: any = '';
  isLoad = false;

  displayedColumns = ['author', 'group', 'subject', 'file'];

  constructor(
    public dialogRef: MatDialogRef<CheckPlagiarismPopoverComponent>,
    private labsService: LabsService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onSave() {
    this.result = '';
    this.isLoad = true;
    this.labsService.checkPlagiarismSubjects({threshold: this.percent.toString(), subjectId: this.data.body, type: this.labelPosition})
      .subscribe(res => {
        this.isLoad = false;
        if (res) {
          this.result = res
        }
    });
  }

  downloadFile(element) {
    window.open('http://localhost:8080/api/Upload?fileName=' + element.DocPathName + '//' + element.DocFileName)
  }
}
