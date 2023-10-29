import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { StreamHandlerComponent } from './stream-handler.component'

describe('StreamHandlerComponent', () => {
  let component: StreamHandlerComponent
  let fixture: ComponentFixture<StreamHandlerComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StreamHandlerComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamHandlerComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
