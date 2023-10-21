import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { ModuleCommunicationComponent } from './module-communication.component'

describe('ModuleCommunicationComponent', () => {
  let component: ModuleCommunicationComponent
  let fixture: ComponentFixture<ModuleCommunicationComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleCommunicationComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleCommunicationComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
