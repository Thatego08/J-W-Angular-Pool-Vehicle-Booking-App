import { TestBed } from '@angular/core/testing';

import { RefuelvehicleService } from './refuelvehicle.service';

describe('RefuelvehicleService', () => {
  let service: RefuelvehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefuelvehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
