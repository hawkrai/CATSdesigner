import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ComplexService } from '../service/complex.service';


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
    private complexService: ComplexService)
  {
    this.complexID = this.router.getCurrentNavigation().extras.state;
    this.complexService.getConceptNameById(this.complexID).subscribe(name => this.complexName = name);
  }

  ngOnInit() {
      
  }
}
