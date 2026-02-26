import { TestBed } from '@angular/core/testing';

import { RateEEserviceService } from './rate-eeservice.service';

describe('RateEEserviceService', () => {
  let service: RateEEserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateEEserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
