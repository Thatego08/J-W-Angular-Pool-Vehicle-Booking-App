import { TestBed } from '@angular/core/testing';

import { RefuelVehicleService } from './refuelvehicle.service';

describe('RefuelvehicleService', () => {
  let service: RefuelVehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefuelVehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
