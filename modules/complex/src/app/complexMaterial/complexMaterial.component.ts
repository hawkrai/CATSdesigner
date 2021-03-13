import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ComplexService } from '../service/complex.service';
import { AddMaterialPopoverComponent } from './components/materials/add-material-popover/add-material-popover.component';


@Component({
  selector: 'app-labs',
  templateUrl: './complexMaterial.component.html',
  styleUrls: ['./complexMaterial.component.less']
})
export class ComplexMaterialComponent implements OnInit {
  public tab = 1;
  public complexID;
  public complexName: string;

  constructor(private router: Router,
    public dialog: MatDialog,
    private complexService: ComplexService)
  {
    this.complexID = this.router.getCurrentNavigation().extras.state;
    if (this.complexID) {
      localStorage.setItem('selectedComplex', this.complexID);
    }
    else {
      this.complexID = localStorage.getItem('selectedComplex');
    }   
    this.complexService.getConceptNameById(this.complexID).subscribe(name => this.complexName = name);
  }

  ngOnInit() {
    
  }

  openAddPopup(): void {
    const dialogRef = this.dialog.open(AddMaterialPopoverComponent, {
      width: '600px',      
      data: { name: 'name', attachments: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  
}
