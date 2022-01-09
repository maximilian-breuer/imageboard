import { TestBed } from '@angular/core/testing';

import { ImageCollectionService } from './imageCollection.service';

describe('ImageCollectionService', () => {
  let service: ImageCollectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCollectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
