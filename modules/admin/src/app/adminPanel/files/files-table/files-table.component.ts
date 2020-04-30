import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { FileService } from 'src/app/service/file.service';
import { File } from 'src/app/model/file';

@Component({
  selector: 'app-files-table',
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.css']
})
export class FilesTableComponent implements OnInit {

  isLoad: boolean;
  displayedColumns = ['id', 'Name', 'nameOnDisk', 'packageOnDisk', 'type'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private fileService: FileService) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadFile();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadFile() {
    this.fileService.getFiles().subscribe(items => {
      this.dataSource.data = items.Files;
      this.isLoad = true;
    });
  }

}
