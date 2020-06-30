import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {FileService} from '../../../service/file.service';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit {

  isLoad: boolean;
  file: any;
  displayedColumns = ['id', 'Name', 'nameOnDisk', 'packageOnDisk'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private dialog: MatDialog, private fileService: FileService) { }

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

  downloadFile(path, filename) {
    this.fileService.downloadFile(path, filename);
  }

}
