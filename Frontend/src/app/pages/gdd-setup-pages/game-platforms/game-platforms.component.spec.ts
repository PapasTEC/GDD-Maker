import { ComponentFixture, TestBed } from "@angular/core/testing";

import { GamePlatformsComponent } from "./game-platforms.component";

describe("GamePlatformsComponent", () => {
  let component: GamePlatformsComponent;
  let fixture: ComponentFixture<GamePlatformsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamePlatformsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GamePlatformsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
