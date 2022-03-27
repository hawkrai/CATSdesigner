import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { UserService } from 'src/app/service/userService';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'subjectStatus', 'lectures'];
  dataSource = new MatTableDataSource<object>();
  subjectInfo;
  isLoad = false;

  constructor(private userService: UserService, public dialogRef: MatDialogRef<SubjectListComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.loadData(this.data);
  }

  getSubjectStatus(status) {
    if(status[0] == true){
      return "Активен"
    }
    else{
    return "Откреплен"
  }
  }

  loadData(studentId) {
    this.userService.getListOfAllSubjectsByStudentId(studentId).subscribe( result => {
      this.subjectInfo = result;
      this.isLoad = true;
    });
  }

}
