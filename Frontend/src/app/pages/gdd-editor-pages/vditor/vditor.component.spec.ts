import { ComponentFixture, TestBed } from "@angular/core/testing";

import { VditorComponent } from "./vditor.component";

describe("VditorComponent", () => {
  let component: VditorComponent;
  let fixture: ComponentFixture<VditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
