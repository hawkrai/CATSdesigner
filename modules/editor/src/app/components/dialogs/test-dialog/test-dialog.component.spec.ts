/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { DebugElement } from '@angular/core'

import { TestDialogComponent } from './test-dialog.component'

describe('TestDialogComponent', () => {
  let component: TestDialogComponent
  let fixture: ComponentFixture<TestDialogComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TestDialogComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TestDialogComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
