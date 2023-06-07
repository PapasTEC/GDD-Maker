import { Routes } from "@angular/router";

import { ElevatorPitchComponent } from "../../pages/gdd-setup-pages/elevator-pitch/elevator-pitch.component";
import { GameGenreComponent } from "../../pages/gdd-setup-pages/game-genre/game-genre.component";
import { GameLogoComponent } from "../../pages/gdd-setup-pages/game-logo/game-logo.component";
import { GamePlatformsComponent } from "../../pages/gdd-setup-pages/game-platforms/game-platforms.component";
import { GameTitleComponent } from "../../pages/gdd-setup-pages/game-title/game-title.component";
import { MainAestheticComponent } from "../../pages/gdd-setup-pages/main-aesthetic/main-aesthetic.component";
import { FinishSetupComponent } from "../../pages/gdd-setup-pages/finish-setup/finish-setup.component";

export const GddSetupLayoutRoutes: Routes = [
  { path: "title", component: GameTitleComponent, data: { type: "game" } },
  { path: "logo", component: GameLogoComponent, data: { type: "game" } },
  {
    path: "company-name",
    component: GameTitleComponent,
    data: { type: "company" },
  },
  {
    path: "company-logo",
    component: GameLogoComponent,
    data: { type: "company" },
  },
  { path: "tags", component: GameGenreComponent },
  { path: "platforms", component: GamePlatformsComponent },
  {
    path: "elevator-pitch",
    component: ElevatorPitchComponent,
    data: { type: "elevator" },
  },
  {
    path: "game-theme",
    component: ElevatorPitchComponent,
    data: { type: "theme" },
  },
  { path: "main-aesthetic", component: MainAestheticComponent },
  {
    path: "core-mechanic",
    component: GameTitleComponent,
    data: { type: "core" },
  },
  { path: "finish-setup", component: FinishSetupComponent },
];
