import { Routes } from '@angular/router';


import { LoginComponent } from '../../pages/login/login.component';
import { RegisterComponent } from '../../pages/register/register.component';

import { ElevatorPitchComponent } from "../../pages/gdd-setup-pages/elevator-pitch/elevator-pitch.component";
import { GameGenreComponent } from "../../pages/gdd-setup-pages/game-genre/game-genre.component";
import { GameLogoComponent} from "../../pages/gdd-setup-pages/game-logo/game-logo.component";
import { GamePlatformsComponent } from "../../pages/gdd-setup-pages/game-platforms/game-platforms.component";
import { GameTitleComponent } from "../../pages/gdd-setup-pages/game-title/game-title.component";
import { HighLevelDesignComponent} from "../../pages/gdd-setup-pages/high-level-design/high-level-design.component";

export const GddSetupLayoutRoutes: Routes = [
    { path: 'title',      component: GameTitleComponent },
    { path: 'logo',      component: GameLogoComponent },

    { path: 'comp-name',      component: GameTitleComponent, data: {type: "company"} },
    { path: 'comp-logo',      component: GameLogoComponent, data: {type: "company"} },
    
    { path: 'genre',      component: GameGenreComponent },
    { path: 'platforms',      component: GamePlatformsComponent },
    { path: 'elev',      component: ElevatorPitchComponent },
    { path: 'design',      component: HighLevelDesignComponent },

];

// 



