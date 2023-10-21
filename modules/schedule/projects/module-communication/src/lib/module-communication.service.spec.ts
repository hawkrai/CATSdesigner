import { TestBed } from '@angular/core/testing'

import { ModuleCommunicationService } from './module-communication.service'

describe('ModuleCommunicationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: ModuleCommunicationService = TestBed.get(
      ModuleCommunicationService
    )
    expect(service).toBeTruthy()
  })
})
