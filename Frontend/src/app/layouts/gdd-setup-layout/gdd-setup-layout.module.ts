


import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';
import { GddSetupLayoutRoutes } from './gdd-setup-layout.routing';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ElevatorPitchComponent } from "../../pages/gdd-setup-pages/elevator-pitch/elevator-pitch.component";
import { GameGenreComponent } from "../../pages/gdd-setup-pages/game-genre/game-genre.component";
import { GameLogoComponent} from "../../pages/gdd-setup-pages/game-logo/game-logo.component";
import { GamePlatformsComponent } from "../../pages/gdd-setup-pages/game-platforms/game-platforms.component";
import { GameTitleComponent } from "../../pages/gdd-setup-pages/game-title/game-title.component";
import { HighLevelDesignComponent} from "../../pages/gdd-setup-pages/high-level-design/high-level-design.component";

// import { ToastrModule } from 'ngx-toastr';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(GddSetupLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
  ],
  declarations: [
    UserProfileComponent,
    TablesComponent,
    IconsComponent,
    MapsComponent,
    
  ]
})

export class GDDSetupLayoutModule {}

