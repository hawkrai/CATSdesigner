
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../core/services/auth.service';
import { ProfileData } from '../core/models/searchResults/personal-data';
import { ProfileService } from '../core/services/searchResults/profile.service';
import { Location } from '@angular/common';
import { PersonalDataService } from '../core/services/personal-data.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ChangePasswordDialog } from '../change-password-dialog/change-password-dialog.component';
import { Validators, FormControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-change-personal-data',
  templateUrl: './change-personal-data.component.html',
  styleUrls: ['./change-personal-data.component.less']
})

export class ChangePersonalDataComponent implements OnInit {
  isLoad = false;
  defaultAvatar!: string;
  startImgFileStr = "data:image/";
  imageFormats = ["png","img","jpg","gif"];
  currentUserId!: number;
  profileData!: ProfileData;

  emailFormControl = new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z0-9_.-]{3,30}@[a-z]{3,30}[.]{1}[a-z]{2,30}$')]);
  phoneFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{0,20}$')]);
  nameFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[А-Яа-яA-Za-z]{6,30}$')])

  surnameFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[А-Яа-яA-Za-z]{6,30}$')])

  patronymicFormControl = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30),
  Validators.pattern('^[А-Яа-яA-Za-z]{6,30}$')])

  constructor(private autService: AuthenticationService, private dataService: PersonalDataService,
    private profileService: ProfileService, private location: Location, public dialog: MatDialog) { }


  onFileSelected(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var buffer = this;

    reader.onloadend = function () {
      if (buffer.isGoodAvatarImage(reader.result.toString())) {
        buffer.profileData.Avatar = reader.result.toString();
      }
      else {
        alert("Неверный формат изображения!");
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
    this.getAvatar();
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

  getAvatar() {
    this.profileService.getDefaultAvatar().subscribe(res => {
      this.defaultAvatar = res;
    });
  }

  updatePersonalInfo() {
    if ((!this.phoneFormControl.invalid || this.profileData.Phone == "") && (!this.emailFormControl.invalid || this.profileData.Email == "")) {
      if (confirm("Вы уверены что хотите сохранить изменения?")) {
        this.dataService.changeProfileData(this.profileData, this.profileData.Avatar).subscribe(res => {
          if (res) {
            alert("Изменения сохранены");
          }

          else {
            alert("Изменения не сохранены");
          }
        });
      }
    }

    else {
      alert("Некоторые поля заполнены некорректно, убедитесь что поля запонены верно или являются полностью пустыми (необязательные поля)");
    }


  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswordDialog, {
      width: '330px',
    });
  }
}
