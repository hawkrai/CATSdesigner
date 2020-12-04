import { MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/typings/portal';
import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { DialogData } from '../models/dialog-data.model';

@Injectable({ providedIn: 'root' })
export class DialogService {

    constructor(
        private dialog: MatDialog
    ) {}

    openDialog<T>(data: DialogData, dialogComponent: ComponentType<T>): MatDialogRef<T> {
        return this.dialog.open(dialogComponent, { data, autoFocus: false });
    }
}