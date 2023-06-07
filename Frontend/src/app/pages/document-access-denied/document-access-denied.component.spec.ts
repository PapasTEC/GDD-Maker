import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentAccessDeniedComponent } from "./document-access-denied.component";

describe("DocumentAccessDeniedComponent", () => {
  let component: DocumentAccessDeniedComponent;
  let fixture: ComponentFixture<DocumentAccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentAccessDeniedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentAccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
