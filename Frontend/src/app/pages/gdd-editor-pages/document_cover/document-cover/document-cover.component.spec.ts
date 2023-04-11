import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCoverComponent } from './document-cover.component';

describe('DocumentCoverComponent', () => {
  let component: DocumentCoverComponent;
  let fixture: ComponentFixture<DocumentCoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentCoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
