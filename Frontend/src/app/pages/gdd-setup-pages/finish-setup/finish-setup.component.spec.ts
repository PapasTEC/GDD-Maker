import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishSetupComponent } from './finish-setup.component';

describe('FinishSetupComponent', () => {
  let component: FinishSetupComponent;
  let fixture: ComponentFixture<FinishSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinishSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
