import {Observable} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CoreService} from './../../../../core/services/core.service';
import {AuthenticationService} from './../../../../core/services/auth.service';
import {Message} from './../../../../core/models/message';
import {map, mergeMap} from 'rxjs/operators';
import {Module, ModuleType} from 'src/app/core/models/module';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  public selectedModule: SafeResourceUrl;
  // public modules$: Observable<Module[]>;
  public clickedItem: string;
  public isLector:boolean = false;
  private originalModule: string;
  private availableFragments =  ["news", "lectures", "labs", "practical", "testsModule", "course", "settings", "libBook", "complex"];
  private availablePagesFromFragment =  ["news", "lectures", "labs", "practical", "page", "", "settings", "libBook", ""];
  constructor(
    private sanitizer: DomSanitizer,
    private coseService: CoreService,
    private router: Router,
    private location: Location,
    private activeRouter: ActivatedRoute,
    private iconRegistry: MatIconRegistry,
    private autService: AuthenticationService ) { }

  ngOnInit(): void {
    this.isLector = this.autService.currentUserValue.role == "lector";
    // this.modules$ = this.activeRouter.params.pipe(
    //   map((params: Params) => params.id),
    //   mergeMap(id => this.coseService.getSubjectSelectedModules(id)));

    this.activeRouter.fragment.subscribe((fragment: string) => {
      let index = this.availableFragments.indexOf(fragment);
      if(index >= 0){
        this.clickedItem = fragment
      } else {
        index = 0;
        this.clickedItem = this.availableFragments[0];
      }
      this.navigate(this.clickedItem);
      this.initState(this.availablePagesFromFragment[index]);
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
  }

  private navigate(fragment: string) {
    let url = this.router.createUrlTree([], { fragment: fragment }).toString();
    this.location.go(url);
  }

  private initState(fragment:string): void {
    this.originalModule = this.getModuleFromFragment();
    this.selectedModule = this.sanitizer.bypassSecurityTrustResourceUrl(`/${this.originalModule}/${fragment}`);
  }

  private getModuleFromFragment(): string {
    switch (this.clickedItem) {
      case "news":
        return "subject";
        break;
      case "lectures":
        return "subject";
        break;
      case "labs":
        return "subject";
        break;
      case "practical":
        return "subject";
        break;
      case "testsModule":
        return "testsModule";
        break;
      case "course":
        return "course";
      case "libBook":
        return "libBook";
        break;
      case "complex":
        return "complex";
        break;
      case "settings":
        return "subject";
        break;
      default:
        break;
    }
  }

  openModule(fragment: string, module: string, item: string) {
    this.clickedItem = item;
    if (this.originalModule == module) {
      let message: Message = new Message();
      message.Value = fragment;
      message.Type = "Route";
      this.coseService.sendMessage(message);
    }
    else {
      this.originalModule = module;
      this.selectedModule = this.sanitizer.bypassSecurityTrustResourceUrl(`/${module}/${fragment}`);
    }
    this.navigate(this.clickedItem);
  }

  getFragmentByModuleType(type: ModuleType): string {
    switch (type) {
      case ModuleType.News:
        return 'news';
      case ModuleType.Lectures:
        return 'lectures';
      case ModuleType.Practical:
        return 'practical';
      case ModuleType.Labs:
        return 'labs';
      case ModuleType.SmartTest:
        return 'page';
      case ModuleType.YeManagment:
        return '';
      case ModuleType.ComplexMaterial:
        return '';
    }
  }

  getClickedItem(type: ModuleType): string {
    switch (type) {
      case ModuleType.News:
        return 'news';
      case ModuleType.Lectures:
        return 'lectures';
      case ModuleType.Practical:
        return 'practical';
      case ModuleType.Labs:
        return 'labs';
      case ModuleType.SmartTest:
        return 'testModule';
      case ModuleType.YeManagment:
        return 'course';
      case ModuleType.ComplexMaterial:
        return 'complex';
    }
  }

  getModule(type: ModuleType) {
    switch (type) {
      case ModuleType.News:
      case ModuleType.Lectures:
      case ModuleType.Practical:
      case ModuleType.Labs:
        return 'subject';
      case ModuleType.SmartTest:
        return 'testModule';
      case ModuleType.YeManagment:
        return 'course';
      case ModuleType.ComplexMaterial:
        return 'complex';
    }
  }

  getImage(type: ModuleType): string {
    switch (type) {
      case ModuleType.News:
      case ModuleType.Lectures:
      case ModuleType.Practical:
      case ModuleType.Labs:
        return 'subject';
      case ModuleType.SmartTest:
        return 'assessment';
      case ModuleType.YeManagment:
        return 'school';
      case ModuleType.ComplexMaterial:
        return 'topic';
      default:
        return 'clear';
    }
  }
}
