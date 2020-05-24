import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CoreService } from './../../../../core/services/core.service';
import { Message } from './../../../../core/models/message';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  public selectedModule: SafeResourceUrl;
  private originalModule: string; 
  constructor(private sanitizer: DomSanitizer, private coseService: CoreService, private router: Router) { }

  ngOnInit(): void {
    this.initState();
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;    
  }

  private initState(): void {
    this.originalModule = "subject";
    this.selectedModule = this.sanitizer.bypassSecurityTrustResourceUrl(`/${this.originalModule}`);
  }

  openModule(fragment: string, module: string) {
    if (this.originalModule == module) {
      let message: Message = new Message();
      message.Value = fragment;
      message.Type = "Route";
      this.coseService.sendMessage(message);
    }
    else {
      this.originalModule = module;
      this.selectedModule = this.sanitizer.bypassSecurityTrustResourceUrl(`/${module}`);      
    }    
  }

}
