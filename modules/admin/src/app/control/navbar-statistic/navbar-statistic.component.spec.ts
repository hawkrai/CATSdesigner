import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { NavbarStatisticComponent } from './navbar-statistic.component'

describe('NavbarStatisticComponent', () => {
  let component: NavbarStatisticComponent
  let fixture: ComponentFixture<NavbarStatisticComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarStatisticComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarStatisticComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
