import { TestBed } from '@angular/core/testing';

import { BottomsheetOpenedService } from './bottomsheet-opened.service';

describe('BottomsheetOpenedService', () => {
  let service: BottomsheetOpenedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BottomsheetOpenedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
