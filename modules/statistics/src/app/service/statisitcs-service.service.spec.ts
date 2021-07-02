import { TestBed } from '@angular/core/testing';

import { StatisitcsServiceService } from './statisitcs-service.service';

describe('StatisitcsServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StatisitcsServiceService = TestBed.get(StatisitcsServiceService);
    expect(service).toBeTruthy();
  });
});
