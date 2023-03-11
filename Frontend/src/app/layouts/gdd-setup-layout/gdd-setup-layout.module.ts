import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { GddSetupLayoutRoutes } from './gdd-setup-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ElevatorPitchComponent } from "../../pages/gdd-setup-pages/elevator-pitch/elevator-pitch.component";
import { GameGenreComponent } from "../../pages/gdd-setup-pages/game-genre/game-genre.component";
import { GameLogoComponent} from "../../pages/gdd-setup-pages/game-logo/game-logo.component";
import { GamePlatformsComponent } from "../../pages/gdd-setup-pages/game-platforms/game-platforms.component";
import { GameTitleComponent } from "../../pages/gdd-setup-pages/game-title/game-title.component";
import { HighLevelDesignComponent} from "../../pages/gdd-setup-pages/high-level-design/high-level-design.component";
import { MainAestheticComponent } from "../../pages/gdd-setup-pages/main-aesthetic/main-aesthetic.component";
import { FinishSetupComponent } from "../../pages/gdd-setup-pages/finish-setup/finish-setup.component";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(GddSetupLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    FontAwesomeModule,
  ],
  declarations: [
    ElevatorPitchComponent,
    GameGenreComponent,
    GameLogoComponent,
    GamePlatformsComponent,
    GameTitleComponent,
    HighLevelDesignComponent,
    MainAestheticComponent,
    FinishSetupComponent,

  ]
})

export class GDDSetupLayoutModule {}