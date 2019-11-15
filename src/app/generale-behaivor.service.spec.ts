import { TestBed } from '@angular/core/testing';

import { GeneraleBehaivorService } from './service/generale-behaivor.service';

describe('GeneraleBehaivorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneraleBehaivorService = TestBed.get(GeneraleBehaivorService);
    expect(service).toBeTruthy();
  });
});
