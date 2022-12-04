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
  displayedColumns = ['id', 'Name', 'date', 'author', 'size', 'nameOnDisk', 'packageOnDisk'];
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

  getDateString(date : Date){
    return date.toDateString();;
  }

  getAuthor(AuthorName){
    if(AuthorName != null)
    {
      return AuthorName;
    }

    else{
      return 'Нет данных'
    }
  }

  getDate(CreationDateString){
    if(CreationDateString != null)
    {
      return CreationDateString;
    }

    else{
      return 'Нет данных'
    }
  }

  getSize(size) {
    if (size != null) {
      return this.toReadableFileSize(size);
    }
    else {
      return 'Нет данных';
    }
  }

  toReadableFileSize(size) {
    const units = ['B', 'kB', 'MB', 'GB', 'TB'];

    let i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return `${(size / Math.pow(1024, i)).toFixed(2)} ${units[i]}`;
  }

}
