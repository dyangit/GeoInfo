import { TestBed } from '@angular/core/testing';

import { ReversegeosearchService } from './reversegeosearch.service';

describe('ReversegeosearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReversegeosearchService = TestBed.get(ReversegeosearchService);
    expect(service).toBeTruthy();
  });
});
