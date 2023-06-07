import { ComponentFixture, TestBed } from "@angular/core/testing";

import { MainAestheticComponent } from "./main-aesthetic.component";

describe("MainAestheticComponent", () => {
  let component: MainAestheticComponent;
  let fixture: ComponentFixture<MainAestheticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainAestheticComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainAestheticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
