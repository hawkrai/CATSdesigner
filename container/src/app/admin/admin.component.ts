import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.less']
})
export class AdminComponent implements OnInit {
  @ViewChild('frame') iframeRef: ElementRef;

  subUrl = sessionStorage.getItem('iframeUrl') || '/admin'

  constructor() {  }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    const fragment = this.iframeRef.nativeElement.contentWindow.location.href;
    sessionStorage.setItem('iframeUrl', this.iframeRef.nativeElement.contentWindow.location.pathname);
  }

  ngOnInit() {
    
  }
}
