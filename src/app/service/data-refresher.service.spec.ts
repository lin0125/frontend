import { TestBed } from '@angular/core/testing';

import { DataRefresherService } from './data-refresher.service';

describe('DataRefresherService', () => {
  let service: DataRefresherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataRefresherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
