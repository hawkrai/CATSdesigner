import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { SearchGroupComponent } from '../control/modal/search-group/search-group.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  groupName: string;
  @Output() submitEM = new EventEmitter();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  openControlGroupDialog() {
    const dialogRef = this.dialog.open(SearchGroupComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.groupName = result;
    });
  }

}
