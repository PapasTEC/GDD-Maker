import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DetailCoreMechanicComponent } from "./detail_core_mechanic.component";

describe("DetailCoreMechanicComponent", () => {
  let component: DetailCoreMechanicComponent;
  let fixture: ComponentFixture<DetailCoreMechanicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailCoreMechanicComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailCoreMechanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
