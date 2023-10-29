/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { CopyFromOtherSubjectDialogComponent } from './copy-from-other-subject-dialog.component'

describe('CopyFromOtherSubjectDialogComponent', () => {
  let component: CopyFromOtherSubjectDialogComponent
  let fixture: ComponentFixture<CopyFromOtherSubjectDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CopyFromOtherSubjectDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyFromOtherSubjectDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
