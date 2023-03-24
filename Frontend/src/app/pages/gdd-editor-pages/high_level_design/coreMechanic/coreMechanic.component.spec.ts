import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreMechanicComponent } from './coreMechanic.component';

describe('CoreMechanicComponent', () => {
  let component: CoreMechanicComponent;
  let fixture: ComponentFixture<CoreMechanicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreMechanicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreMechanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
