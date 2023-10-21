import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SubjectsNavComponent } from './subjects-nav.component'

describe('SubjectsNavComponent', () => {
  let component: SubjectsNavComponent
  let fixture: ComponentFixture<SubjectsNavComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectsNavComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectsNavComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
