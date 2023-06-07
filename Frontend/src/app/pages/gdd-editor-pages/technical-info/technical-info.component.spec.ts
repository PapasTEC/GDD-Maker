import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TechnicalInfoComponent } from "./technical-info.component";

describe("TechnicalInfoComponent", () => {
  let component: TechnicalInfoComponent;
  let fixture: ComponentFixture<TechnicalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechnicalInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TechnicalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
