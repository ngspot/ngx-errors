import { TestBed } from '@angular/core/testing';

import { NgxErrorsService } from './ngx-errors.service';

describe('NgxErrorsService', () => {
  let service: NgxErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
