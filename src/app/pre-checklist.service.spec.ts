import { TestBed } from '@angular/core/testing';

import { PreChecklistService } from './pre-checklist.service';

describe('PreChecklistService', () => {
  let service: PreChecklistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreChecklistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
