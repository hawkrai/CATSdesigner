import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { FileService } from 'src/app/service/file.service';
import { SuccessMessageComponent } from 'src/app/success-message/success-message.component';
import { downloadFile } from 'file-saver';


@Component({
  selector: 'app-files-table',
  templateUrl: './files-table.component.html',
  styleUrls: ['./files-table.component.css']
})
export class FilesTableComponent implements OnInit {

  isLoad: boolean;
  file: any;
  displayedColumns = ['id', 'Name', 'nameOnDisk', 'packageOnDisk', 'type'];
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

  uploadFile(path, filename) {
    this.fileService.uploadFile(path, filename);
  }

}
