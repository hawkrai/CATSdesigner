import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ComplexService } from '../service/complex.service';
import { AddMaterialPopoverComponent } from './components/materials/add-material-popover/add-material-popover.component';
import { Concept } from '../models/Concept';


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
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.router.onSameUrlNavigation = 'reload';

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
      data: { id: '0', attachments: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const concept: Concept =
        {
          conceptId: +result.id,
          conceptName: result.name,
          parentId: result.parentId,
          isGroup: result.isGroup,
          fileData: JSON.stringify(result.attachments),
          userId: JSON.parse(localStorage.getItem("currentUser")).id
        };

        this.complexService.addOrEditConcept(concept).subscribe(res =>
        {
          if (res['Code'] === '200') {
            this.router.navigateByUrl('/cMaterial');
          }
        });
      }
    })    
  }  
}
