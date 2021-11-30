import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoHandlerComponent } from './video-handler.component';

describe('VideoHandlerComponent', () => {
  let component: VideoHandlerComponent;
  let fixture: ComponentFixture<VideoHandlerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoHandlerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoHandlerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
