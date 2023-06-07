import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GddSetupLayoutComponent } from "./gdd-setup-layout.component";

describe("GddSetupLayoutComponent", () => {
  let component: GddSetupLayoutComponent;
  let fixture: ComponentFixture<GddSetupLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GddSetupLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GddSetupLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
