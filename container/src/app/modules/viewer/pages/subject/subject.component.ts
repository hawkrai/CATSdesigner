import { take, tap } from 'rxjs/operators';
import { MenuService } from './../../../../core/services/menu.service';
import { Module, ModuleType } from './../../../../core/models/module.model';
import { switchMap, map } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute, Params  } from '@angular/router';
import { CoreService } from './../../../../core/services/core.service';
import { AuthenticationService } from './../../../../core/services/auth.service';
import { Message } from './../../../../core/models/message';
import { combineLatest, Observable } from 'rxjs';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatSidenav) sideNav: MatSidenav;
  public selectedModule: SafeResourceUrl;
  public clickedItem: string;
  public isLector:boolean = false;
  private originalModule: string; 

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: (event: MediaQueryListEvent) => void;
  @HostListener("window:scroll", ["$event"])
  onWindowScroll(event:Event) {
    event.stopPropagation();
  }
  modules$: Observable<Module[]>;

  constructor(
    private sanitizer: DomSanitizer, 
    private coreService: CoreService, 
    private router: Router, 
    private location: Location, 
    private activeRouter: ActivatedRoute, 
    private autService: AuthenticationService,
    private menuService: MenuService,
    changeDetectorRef: ChangeDetectorRef, media: MediaMatcher ) { 
      this.mobileQuery = media.matchMedia('(max-width: 970px)');
      this._mobileQueryListener = () => {
        changeDetectorRef.detectChanges();
      };
      this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    }
  ngAfterViewInit(): void {
    this.menuService.setSideNav(this.sideNav);
  }

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

    this.modules$ = this.activeRouter.params.pipe(
      switchMap((params: Params) => this.coreService.getSubjectModules(+params.id))
    );
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

  
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
