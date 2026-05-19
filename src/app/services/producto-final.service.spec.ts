import { TestBed } from '@angular/core/testing';

import { ProductoFinalService } from './producto-final.service';

describe('ProductoFinalService', () => {
  let service: ProductoFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductoFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
