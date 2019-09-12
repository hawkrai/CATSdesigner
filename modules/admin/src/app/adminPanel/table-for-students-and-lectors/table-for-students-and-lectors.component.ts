import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, Sort, MatSort, MatDialog } from '@angular/material';
import { DeleteLectorComponent } from '../modal/delete-lector/delete-lector.component';
import { EditLectorComponent } from '../modal/edit-lector/edit-lector.component';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export class LectorData {
  login: string;
  password: string;
  confirmPassword: string;
  lastname: string;
  firstname: string;
  middleName: string;
  secretary: any;
  head: any;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

@Component({
  selector: 'app-table-for-students-and-lectors',
  templateUrl: './table-for-students-and-lectors.component.html',
  styleUrls: ['./table-for-students-and-lectors.component.css']
})
export class TableForStudentsAndLectorsComponent implements OnInit {

  dataLector = new  LectorData();
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 's', 'y'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;

  sortedData: PeriodicElement[];

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = ELEMENT_DATA.slice();
    this.dataLector.lastname = 'Попова';
    this.dataLector.firstname = 'Юлия';
    this.dataLector.middleName = 'Борисовна';
    this.dataLector.secretary = true;
    this.dataLector.head = true;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDelete() {
    const dialogRef = this.dialog.open(DeleteLectorComponent, {
      data: {
        isDelete: this.isDelete,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.isDelete = result;
    });
  }

  openDialogEdit() {
    const dialogRef = this.dialog.open(EditLectorComponent, {
      data: {
        lastName: this.dataLector.lastname,
        firstName: this.dataLector.firstname,
        middleName: this.dataLector.middleName,
        secretary: this.dataLector.secretary,
        head: this.dataLector.head
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.dataLector = result;
    });
    console.log(this.dataLector);
  }

}
