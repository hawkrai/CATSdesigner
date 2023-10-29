import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TableForAllSubjectComponent } from './table-for-all-subject.component'

describe('TableForAllSubjectComponent', () => {
  let component: TableForAllSubjectComponent
  let fixture: ComponentFixture<TableForAllSubjectComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableForAllSubjectComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TableForAllSubjectComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
