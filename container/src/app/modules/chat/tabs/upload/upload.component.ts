import { Component } from "@angular/core";
import {MatDialog} from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { DataService } from "../../services/dataService";
@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: './upload.component.html',
    styleUrls: [ './upload.component.scss' ]  
    })
  export class UploadComponent {
    files: any[] = [];
    constructor(private http: HttpClient,private dataService:DataService)
    {
      this.files=dataService.files;
    }
 
    onFileDropped($event) {
      this.prepareFilesList($event);
    }
  
    fileBrowseHandler(files) {
      this.prepareFilesList(files);
    }
  
    deleteFile(index: number) {
      this.files.splice(index, 1);
    }
  
    uploadFilesSimulator(index: number) {
      setTimeout(() => {
        if (index === this.files.length) {
          return;
        } else {
          const progressInterval = setInterval(() => {
            if (this.files[index].progress === 100) {
              clearInterval(progressInterval);
              this.uploadFilesSimulator(index + 1);
            } else {
              this.files[index].progress += 5;
            }
          }, 200);
        }
      }, 1000);
    }
  
    prepareFilesList(files: Array<any>) {
      for (const item of files) {
        item.progress = 0;
        this.files.push(item);
      }
      this.uploadFilesSimulator(0);
    }
    formatBytes(bytes, decimals) {
      if (bytes === 0) {
        return '0 Bytes';
      }
      const k = 1024;
      const dm = decimals <= 0 ? 0 : decimals || 2;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }  
}