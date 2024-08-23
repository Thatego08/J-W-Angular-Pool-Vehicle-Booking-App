import { TestBed } from '@angular/core/testing';

import { PostCheckService } from './post-check.service';

describe('PostCheckService', () => {
  let service: PostCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostCheckService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
