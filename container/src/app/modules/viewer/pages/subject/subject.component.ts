import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  public selectedModuleUrl: string;
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.selectedModuleUrl = "http://localhost:3000/news";
  }

  moduleSelecteUrl(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.selectedModuleUrl);  
  }

  openModule(url: string) {
    this.selectedModuleUrl = url;
    
  }

}
