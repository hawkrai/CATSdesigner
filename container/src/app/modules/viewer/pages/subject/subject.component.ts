import { take, tap } from 'rxjs/operators';
import { MenuService } from './../../../../core/services/menu.service';
import { Module, ModuleType } from './../../../../core/models/module.model';
import { switchMap, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params  } from '@angular/router';
import { CoreService } from './../../../../core/services/core.service';
import { AuthenticationService } from './../../../../core/services/auth.service';
import { Message } from './../../../../core/models/message';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  public selectedModule: SafeResourceUrl;
  // private availableFragments:string[] =  ["news", "lectures", "labs", "practical", "testsModule", "course", "settings", "libBook", "complex"];
  // private availablePagesFromFragment:string[] =  ["news", "lectures", "labs", "practical", "page", "", "settings", "libBook", ""];
  public clickedItem: string;
  public isLector:boolean = false;
  private originalModule: string; 
  modules$: Observable<Module[]>;
  constructor(
    private sanitizer: DomSanitizer, 
    private coreService: CoreService, 
    private router: Router, 
    private location: Location, 
    private activeRouter: ActivatedRoute, 
    private autService: AuthenticationService,
    private menuService: MenuService ) { }

  ngOnInit(): void {
    this.isLector = this.autService.currentUserValue.role == "lector";

    this.activeRouter.fragment.subscribe((fragment: string) => {
      let type = this.menuService.getModuleTypeByItem(fragment);
      if(type){
        this.clickedItem = fragment
      } else {
        type = this.menuService.getFirstModuleType();
        this.clickedItem = this.menuService.getSubjectInfo(type).item;
      }
      this.navigate(this.clickedItem);
      this.initState(this.menuService.getSubjectInfo(type).fragment);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    // this.modules$ = this.activeRouter.params.pipe(
    //   switchMap((params: Params) => this.coreService.getSubjectModules(+params.id))
    //   ); 
  }

  private navigate(fragment: string) {
    let url = this.router.createUrlTree([], { fragment: fragment }).toString();
    this.location.go(url);
  }

  private initState(fragment:string): void {
    this.originalModule = this.menuService.getModuleFromItem(this.clickedItem);
    this.selectedModule = this.sanitizer.bypassSecurityTrustResourceUrl(`/${this.originalModule}/${fragment}`);
  }

  openModule(fragment: string, module: string, item: string) {
    this.clickedItem = item;
    if (this.originalModule == module) {
      let message: Message = new Message();
      message.Value = fragment;
      message.Type = "Route";
      this.coreService.sendMessage(message);
    }
    else {
      this.originalModule = module;
      this.selectedModule = this.sanitizer.bypassSecurityTrustResourceUrl(`/${module}/${fragment}`);
    }
    this.navigate(this.clickedItem);
  }

  navigateToModule(type: ModuleType): void {
    const config = this.menuService.getSubjectInfo(type);
    this.openModule(config.fragment, config.module, config.item);
  }

  getModuleIcon(type: ModuleType): string {
    return this.menuService.getSubjectInfo(type).icon;
  }

  getModuleItem(type: ModuleType): string {
    return this.menuService.getSubjectInfo(type).item;
  }
}
