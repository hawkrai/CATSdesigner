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

    openDialog<T>(dialogComponent: ComponentType<T>, data: DialogData = null): MatDialogRef<T> {
        return this.dialog.open(dialogComponent, { data, autoFocus: false, position: { top: '0px', left: '0px'}, height: '100vh' });
    }
}