
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/auth.service';
import { ProfileData } from '../core/models/searchResults/personal-data';
import { ProfileService } from '../core/services/searchResults/profile.service';
import { Location } from '@angular/common';
import { PersonalDataService } from '../core/services/personal-data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog.component';
import { Validators, FormControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslatePipe } from '../pipe/translate.pipe';

@Component({
  selector: 'app-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrls: ['./change-personal-data.component.less']
})

export class ChangePersonalDataComponent implements OnInit {
  isLoad = false;
  defaultAvatar = "/assets/images/account.png";
  startImgFileStr = "data:image/";
  imageFormats = ["png","img","jpg","gif"];
  currentUserId!: number;
  profileData!: ProfileData;
  dialogRef: MatDialogRef<any>;

  emailFormControl = new FormControl('', [Validators.pattern('^([A-Za-z0-9_.-]{3,30}@[a-z]{3,30}[.]{1}[a-z]{2,30})?$')]);
  phoneFormControl = new FormControl('', [Validators.pattern('^([0-9]{0,20})?$')]);

  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[А-Яа-яA-Za-z]{3,30}$')])

  surnameFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[А-Яа-яA-Za-z]{3,30}$')])

  patronymicFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[А-Яа-яA-Za-z]{3,30}$')])

  constructor(private autService: AuthenticationService, private dataService: PersonalDataService,
    private profileService: ProfileService, private location: Location, public dialog: MatDialog, private snackBar: MatSnackBar, private translatePipe: TranslatePipe) { }

  onFileSelected(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var buffer = this;

    reader.onloadend = function () {
      if (buffer.isGoodAvatarImage(reader.result.toString())) {
        buffer.profileData.Avatar = reader.result.toString();
      }
      else {
        buffer.addFlashMessage(buffer.translatePipe.transform('text.personalAccount.wrongImage', "Неверный формат изображения!"));
      }
    };

    reader.readAsDataURL(file);
  }

  isGoodAvatarImage(imgeStr: string): boolean {
    if (imgeStr.startsWith(this.startImgFileStr)) {
      return true;
    }
    return false
  }

  ngOnInit(): void {
    this.currentUserId = this.autService.currentUserValue.id;
    this.getProfileData();
    this.isLoad = true;
  }

  backClicked() {
    this.location.back();
  }

  getProfileData() {
    this.dataService.getProfileData().subscribe((res) => {
      this.profileData = res;
    });
  }

  updatePersonalInfo() {
    if ((!this.patronymicFormControl.invalid) && (!this.surnameFormControl.invalid) && (!this.nameFormControl.invalid) &&
      (!this.phoneFormControl.invalid) && (!this.emailFormControl.invalid)) {
        this.dataService.changeProfileData(this.profileData, this.profileData.Avatar).subscribe(res => {
          if (res) {
            this.addFlashMessage(this.translatePipe.transform('text.personalAccount.changesSaved', "Изменения успешно сохранены =)"));
          }

          else {
            this.addFlashMessage(this.translatePipe.transform('text.personalAccount.changesNotSaved', "Изменения не были сохранены =("));
          }
        });
    }

    else {
      this.addFlashMessage(this.translatePipe.transform('text.personalAccount.wrongData', "Некоторые поля не соответствуют формату!"), 5000);
    }
  } 

  openDialog(): void {
    const config = new MatDialogConfig();
    if ((window.screen.width) <= 970) {
      config.width = '70%';
    }
    else {
      config.width = '40%';
    }
    config.height = 'auto';
    this.dialogRef = this.dialog.open(ChangePasswordDialog, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }


  addFlashMessage(msg: string, time = 2000) {
    this.snackBar.open(msg, null, {
      duration: time
    });
  }

}
