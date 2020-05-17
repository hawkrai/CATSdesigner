import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  public selectedModuleUrl: SafeResourceUrl;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.selectedModuleUrl = this.sanitizer.bypassSecurityTrustResourceUrl("http://localhost:3000/news");
  }

  openModule(url: string) {
    this.selectedModuleUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);    
  }

}
