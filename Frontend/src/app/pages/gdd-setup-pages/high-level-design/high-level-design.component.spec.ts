import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighLevelDesignComponent } from './high-level-design.component';

describe('HighLevelDesignComponent', () => {
  let component: HighLevelDesignComponent;
  let fixture: ComponentFixture<HighLevelDesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighLevelDesignComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighLevelDesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
