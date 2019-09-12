import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog } from '@angular/material';
import { DeleteLectorComponent } from '../modal/delete-lector/delete-lector.component';
import { AddGroupComponent } from '../modal/add-group/add-group.component';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


export class Group {
  numb: number;
  yearEnd: string;
  yearBegin: string;
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
  selector: 'app-group-table',
  templateUrl: './group-table.component.html',
  styleUrls: ['./group-table.component.css']
})
export class GroupTableComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 's'];
  dataSource = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;
  group = new Group();

  sortedData: PeriodicElement[];
  constructor(private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.data = ELEMENT_DATA.slice();
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
    const dialogRef = this.dialog.open(AddGroupComponent, {
      data: {
        group: this.group,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.group = result;
    });
    console.log(this.group);
  }
}
