import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { LectorModalComponent } from '../modal/lector-modal/lector-modal.component';
import { Professor } from 'src/app/model/professor';
import { ProfessorService } from 'src/app/service/professor.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { EditLectorComponent } from '../modal/edit-lector/edit-lector.component';
import { ListOfGroupsComponent } from '../modal/list-of-groups/list-of-groups.component';
import { StatisticComponent } from '../modal/statistic/statistic.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lectors',
  templateUrl: './lectors.component.html',
  styleUrls: ['./lectors.component.css']
})

export class LectorsComponent implements OnInit {

  isLoad: boolean;
  dataLector = new Professor();
  displayedColumns: string[] = ['position', 'name', 'login', 'lastLogin', 'status', 'subjects', 'action'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;

  constructor(private dialog: MatDialog, private professorService: ProfessorService, private router: Router) { }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadLector();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigateToProfile(login) {
    this.router.navigate(['admin/profile', login]);
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
    console.log(dataLector);
    const dialogRef = this.dialog.open(EditLectorComponent, {
      data: dataLector
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.data);
        this.editLector(result.data);
      }
    });
  }

  openListOfGroup(lectorId) {
    const dialogRef = this.dialog.open( ListOfGroupsComponent, {
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
        this.addLector(result);
      }
    });
  }

  loadLector() {
    this.professorService.getProfessors().subscribe(items => {
      this.dataSource.data = items;
      this.isLoad = true;
    });
  }

  addLector(professor: Professor): void {
    this.professorService.addProfessor(professor).subscribe(() => {
      this.dataLector = new Professor();
      this.loadLector();
    });
  }

  editLector(professor: Professor): void {
    this.professorService.editProfessor(professor).subscribe(() => {
      this.dataLector = new Professor();
      this.loadLector();
    });
  }

  deleteLector(id) {
    this.professorService.deleteProfessor(id).subscribe(() => {
      this.loadLector();
    });
  }

}
