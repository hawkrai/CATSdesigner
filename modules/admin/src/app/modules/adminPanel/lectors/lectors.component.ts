import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { LectorModalComponent } from '../modal/lector-modal/lector-modal.component';
import { Professor, EditProfessor } from 'src/app/model/professor';
import { ProfessorService } from 'src/app/service/professor.service';
import { AppToastrService } from 'src/app/service/toastr.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { EditLectorComponent } from '../modal/edit-lector/edit-lector.component';
import { ListOfGroupsComponent } from '../modal/list-of-groups/list-of-groups.component';
import { StatisticComponent } from '../modal/statistic/statistic.component';
import { Router } from '@angular/router';
import {MessageComponent} from "../../../component/message/message.component";

@Component({
  selector: 'app-lectors',
  templateUrl: './lectors.component.html',
  styleUrls: ['./lectors.component.css']
})

export class LectorsComponent implements OnInit {

  isLoad: boolean;
  dataLector = new Professor();
  displayedColumns: string[] = ['position', 'FullName', 'Login', 'lastLogin', 'status', 'subjects', 'action'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog, private professorService: ProfessorService, private router: Router, private toastr: AppToastrService) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadLector();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  isNotActive(professor) {
    return !professor.IsActive;
  }

  restoreProfessor(professor) {
    const newProfessorObject = new EditProfessor();
    newProfessorObject.Surname = professor.LastName;
    newProfessorObject.Name = professor.FirstName;
    newProfessorObject.Patronymic = professor.MiddleName || '';
    newProfessorObject.About = professor.About || '';
    newProfessorObject.Avatar = professor.Avatar || '';
    newProfessorObject.Email = professor.Email || '';
    newProfessorObject.Groups = professor.Groups || [];
    newProfessorObject.IsActive = true;
    newProfessorObject.IsLecturerHasGraduateStudents =
    professor.IsLecturerHasGraduateStudents || false;
    newProfessorObject.IsSecretary = professor.IsSecretary || false;
    newProfessorObject.LecturerId = professor.Id;
    newProfessorObject.Phone = professor.Phone || '';
    newProfessorObject.Skill = professor.Skill || '';
    newProfessorObject.SkypeContact = professor.SkypeContact || '';
    newProfessorObject.SelectedGroupIds = professor.SecretaryGroupsIds || [];
    newProfessorObject.UserName = professor.Login || '';
    professor.isActive = true;
    this.editLector(newProfessorObject);
  }

  navigateToProfile(id) {
    this.router.navigate(['profile', id]);
  }

  deleteProfessor(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLector(id);
      }
    });
  }

  openDialogEdit(dataLector) {
    const dialogRef = this.dialog.open(EditLectorComponent, {
      data: dataLector
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.editLector(result.data);
      }
    });
  }

  openListOfGroup(lectorId) {
    const dialogRef = this.dialog.open(ListOfGroupsComponent, {
      data: lectorId
    });
    dialogRef.afterClosed();
  }

  openDiagram(userId) {
    const dialogRef = this.dialog.open(StatisticComponent, {
      data: userId
    });
    dialogRef.afterClosed();
  }

  saveProfessor() {
    const dialogRef = this.dialog.open(LectorModalComponent, {
      data:  this.dataLector
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addLector(result.data);
      }
    });
  }

  loadLector() {
    this.professorService.getProfessors().subscribe(items => {
      this.dataSource.data = items.sort((a,b) => this.sortFunc(a, b));
      this.isLoad = true;
    });
  }

  sortFunc(a, b) { 
    if(a.FullName < b.FullName){
      return -1;
    }

    else if(a.FullName > b.FullName){
      return 1;
    }
    
    return 0;
 } 

  addLector(professor): void {
    this.professorService.addProfessor(professor).subscribe(() => {
      this.loadLector();
      this.dataLector = new Professor();
      this.toastr.addSuccessFlashMessage("Преподаватель добавлен!");}
      );
  }

  editLector(professor): void {
    this.professorService.editProfessor(professor).subscribe(() => {
      this.loadLector();
      this.dataLector = new Professor();
      this.toastr.addSuccessFlashMessage("Преподаватель изменен!");
    }, 
    err => {
      if ( err.status === 500) {
        this.loadLector();
        this.toastr.addSuccessFlashMessage("Преподаватель изменен!");
      } else {
      }
    });
  }

  deleteLector(id) {
    this.professorService.deleteProfessor(id).subscribe(() => {
      this.loadLector();
      this.toastr.addSuccessFlashMessage("Преподаватель удален!");
    });
  }

}
