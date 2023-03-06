import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { GddEditorComponent } from './pages/gdd-editor/gdd-editor.component';
import { GddSetupLayoutComponent } from './layouts/gdd-setup-layout/gdd-setup-layout.component';
import { GameTitleComponent } from './pages/gdd-setup-pages/game-title/game-title.component';
import { GameLogoComponent } from './pages/gdd-setup-pages/game-logo/game-logo.component';

import { GameGenreComponent } from './pages/gdd-setup-pages/game-genre/game-genre.component';
import { GamePlatformsComponent } from './pages/gdd-setup-pages/game-platforms/game-platforms.component';
import { ElevatorPitchComponent } from './pages/gdd-setup-pages/elevator-pitch/elevator-pitch.component';
import { HighLevelDesignComponent } from './pages/gdd-setup-pages/high-level-design/high-level-design.component';


@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    GddEditorComponent,
    GddSetupLayoutComponent,
    GameTitleComponent,
    GameLogoComponent,
    GameGenreComponent,
    GamePlatformsComponent,
    ElevatorPitchComponent,
    HighLevelDesignComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
