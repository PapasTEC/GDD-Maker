import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { EditorLayoutRoutes } from './editor-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VditorComponent } from "../../pages/gdd-editor-pages/vditor/vditor.component";
import { AestheticsComponent } from '../../pages/gdd-editor-pages/high_level_design/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from '../../pages/gdd-editor-pages/high_level_design/coreMechanic/coreMechanic.component';
import { CharactersComponent } from '../../pages/gdd-editor-pages/narrative_and_worldbuilding/characters/characters.component';
import { BasicInfoComponent } from '../../pages/gdd-editor-pages/basic-info/basic-info.component';
import { DetailCoreMechanicComponent } from '../../pages/gdd-editor-pages/low_level_design/detail_core_mechanic/detail_core_mechanic.component';
import { EventsComponent } from '../../pages/gdd-editor-pages/narrative_and_worldbuilding/events/events.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    FontAwesomeModule,
    CommonModule,
    RouterModule.forChild(EditorLayoutRoutes),
    FormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [
    VditorComponent,
    AestheticsComponent,
    CoreMechanicComponent,
    CharactersComponent,
    EventsComponent,
    BasicInfoComponent,
    DetailCoreMechanicComponent,
  ]
})

export class EditorLayoutModule {}
