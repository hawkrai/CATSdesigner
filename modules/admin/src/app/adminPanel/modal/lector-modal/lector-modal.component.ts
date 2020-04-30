import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Professor } from 'src/app/model/professor';
import { ProfessorService } from 'src/app/service/professor.service';

@Component({
  selector: 'app-lector-modal',
  templateUrl: './lector-modal.component.html',
  styleUrls: ['./lector-modal.component.css']
})
export class LectorModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<LectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Professor) { }

  ngOnInit(): void {
    this.data.IsLecturerHasGraduateStudents = false;
    this.data.IsSecretary = false;
    this.data.IsActive = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
