import { TestBed } from '@angular/core/testing';

import { EditingDocumentService } from './editing-document.service';

describe('EditingDocumentService', () => {
  let service: EditingDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditingDocumentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
