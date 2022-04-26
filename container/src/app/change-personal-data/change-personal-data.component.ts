
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/auth.service';
import { ProfileData } from '../core/models/searchResults/personal-data';
import { ProfileService } from '../core/services/searchResults/profile.service';
import { Location } from '@angular/common';
import { PersonalDataService } from '../core/services/personal-data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog.component';
import { Validators, FormControl, ValidationErrors } from '@angular/forms';
import { TranslatePipe } from 'educats-translate';
import { AppToastrService } from '../core/services/toastr.service';

@Component({
  selector: 'app-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrls: ['./change-personal-data.component.less']
})

export class ChangePersonalDataComponent implements OnInit {
  MAX_IMAGE_LEN = 700000;
  isLoad = false;
  defaultAvatar = "/assets/images/account.png";
  startImgFileStr = "data:image/";
  imageFormats = ["png","img","jpg","gif"];
  currentUserId!: number;
  profileData!: ProfileData;
  dialogRef: MatDialogRef<any>;
  nameRegExp = '^[А-Яа-яA-Za-z0-9ёЁіІ _-]*$';
  emailFormControl = new FormControl('', [Validators.pattern('^([A-Za-z0-9_.-]{1,30}@[A-Za-z0-9_.-]{1,30}[.]{1}[A-Za-z0-9_-]{1,30})$')]);
  phoneFormControl = new FormControl('', [Validators.pattern('^([0-9+-]{0,20})$')]);

  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30),
    Validators.pattern(this.nameRegExp)])

  surnameFormControl = new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(30),
    Validators.pattern(this.nameRegExp)])

  patronymicFormControl = new FormControl('', [Validators.minLength(1), Validators.maxLength(30),
    Validators.pattern(this.nameRegExp)])

  constructor(private autService: AuthenticationService, private dataService: PersonalDataService,
    private location: Location, public dialog: MatDialog,
    private toastr: AppToastrService, private translatePipe: TranslatePipe) { }

  onFileSelected(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var buffer = this;
    

    reader.onloadend = function () {
      if (buffer.isGoodAvatarImage(reader.result.toString())) {
        if (reader.result.toString().length < buffer.MAX_IMAGE_LEN) {
          buffer.profileData.Avatar = reader.result.toString();
        }
        else {
          buffer.toastr.addWarningFlashMessage(buffer.translatePipe.transform('text.personalAccount.tooBigImage', "Размер изображения слишком велик!"));
        }
      }
      else {
        buffer.toastr.addWarningFlashMessage(buffer.translatePipe.transform('text.personalAccount.wrongImage', "Неверный формат изображения!"));
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

  setDefaultAvatar(): void {
    this.profileData.Avatar = null;
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
    this.trimFields();
    if ((!this.patronymicFormControl.invalid) && (!this.surnameFormControl.invalid) && (!this.nameFormControl.invalid) &&
      (!this.phoneFormControl.invalid) && (!this.emailFormControl.invalid)) {
        this.dataService.changeProfileData(this.profileData, this.profileData.Avatar).subscribe(res => {
          if (res) {
            this.toastr.addSuccessFlashMessage(this.translatePipe.transform('text.personalAccount.changesSaved', "Изменения успешно сохранены!"));
          }

          else {
            this.toastr.addErrorFlashMessage(this.translatePipe.transform('text.personalAccount.changesNotSaved', "Изменения не были сохранены!"));
          }
        });
    }

    else {
      this.toastr.addWarningFlashMessage(this.translatePipe.transform('text.personalAccount.wrongData', "Некоторые поля не соответствуют формату!"));
    }
  } 

  openDialog(): void {
    const config = new MatDialogConfig();
    if ((window.screen.width) <= 970) {
      config.width = '70%';
      config.height = 'auto';
    }
    else {
      config.width = '40%';
      config.height = '100%';
      config.panelClass = "app-password-dialog";
    }
    this.dialogRef = this.dialog.open(ChangePasswordDialog, config);
    this.dialogRef.afterClosed().subscribe(result => {
      this.dialogRef = null;
    });
  }


  trimFields() {
    if(this.profileData.Name != null)
      this.profileData.Name = this.profileData.Name.trim();
    if(this.profileData.Surname != null)
    this.profileData.Surname = this.profileData.Surname.trim();
    if(this.profileData.Patronymic != null)
    this.profileData.Patronymic = this.profileData.Patronymic.trim();
    if(this.profileData.Email != null)
    this.profileData.Email = this.profileData.Email.trim();
    if(this.profileData.Phone != null)
    this.profileData.Phone = this.profileData.Phone.trim();
  }

  deleteSpaces() {
    if(this.profileData.About != null)
    this.profileData.About = this.delEmptyRows(this.profileData.About);
    if(this.profileData.SkypeContact != null)
    this.profileData.SkypeContact = this.delEmptyRows(this.profileData.SkypeContact);
  }

  delEmptyRows(data: string) {
    var stringArray = data.split('\n');
    var temp = new Array<string>();
    var x = 0;
    for (var i = 0; i < stringArray.length; i++) {
      if (stringArray[i].trim() != "") {
        temp[x] = stringArray[i];
        x++;
      }
    }
    
    return temp.join('\n');
  }

}

