import { Component, EventEmitter, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-labs',
  templateUrl: './complexMaterial.component.html',
  styleUrls: ['./complexMaterial.component.less']
})
export class ComplexMaterialComponent implements OnInit {
  public tab = 1;
  public complexID;

  constructor(private router: Router)
  {
    this.complexID = this.router.getCurrentNavigation().extras.state;
    console.log(this.complexID)
  }

  ngOnInit() {
      
  }
}
