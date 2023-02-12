import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { TranslatePipe } from 'educats-translate';
import { Group } from 'src/app/model/group';
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

  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<SubjectListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transaltePipe: TranslatePipe
    ) { }

  ngOnInit() {
    this.loadData(this.data);
  }

  getSubjectStatus(status) {
    if(status == true){
      return this.transaltePipe.transform("text.adminPanel.modal.subjectList.ongoing", "Текущий")
    }
    else{
    return this.transaltePipe.transform("text.adminPanel.modal.subjectList.completed", "Завершенный")
  }
  }

  loadData(data) {
    if(!this.isGroup(data)){
    this.userService.getListOfAllSubjectsByStudentId(data.Id).subscribe( result => {
      this.subjectInfo = result;
      this.isLoad = true;
    });}

    else{
      this.userService.getListOfAllSubjectsByGroupId(data.Id).subscribe( result => {
        this.subjectInfo = result;
        this.isLoad = true;
      });}
    }
  
  isGroup(data){
    return data.StudentsCount !== undefined;
}

}
