import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentNotFoundComponent } from "./document-not-found.component";

describe("DocumentNotFoundComponent", () => {
  let component: DocumentNotFoundComponent;
  let fixture: ComponentFixture<DocumentNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentNotFoundComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DocumentNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
