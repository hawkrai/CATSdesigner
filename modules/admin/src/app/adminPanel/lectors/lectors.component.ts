import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LectorModalComponent } from '../modal/lector-modal/lector-modal.component';

export interface LectorData {
  login: string;
  password: string;
  confirmPassword: string;
  lastname: string;
  firstname: string;
  middleName: string;
  secretary: any;
  head: any;
}

@Component({
  selector: 'app-lectors',
  templateUrl: './lectors.component.html',
  styleUrls: ['./lectors.component.css']
})

export class LectorsComponent implements OnInit {

  lectorData: LectorData;
  login: string;
  password: string;
  confirmPassword: string;
  lastname: string;
  firstname: string;
  middleName: string;
  secretary: any;
  head: any;

  constructor(private dialog: MatDialog) { }
  ngOnInit(): void {
  }

  openLectorDialog() {
    const dialogRef = this.dialog.open(LectorModalComponent, {
      data: {
        login: this.login,
        password: this.password,
        confirmPassword: this.confirmPassword,
        lastname: this.lastname,
        firstname: this.firstname,
        middleName: this.middleName,
        secretary: this.secretary,
        head: this.head
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.lectorData = result;
    });
  }
}
