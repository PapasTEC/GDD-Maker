import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameLogoComponent } from './game-logo.component';

describe('GameLogoComponent', () => {
  let component: GameLogoComponent;
  let fixture: ComponentFixture<GameLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
