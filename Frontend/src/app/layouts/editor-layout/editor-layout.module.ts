import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { EditorLayoutRoutes } from './editor-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VditorComponent } from "../../pages/gdd-editor-pages/vditor/vditor.component";
import { AestheticsComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/coreMechanic/coreMechanic.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import { CharactersComponent } from 'src/app/pages/gdd-editor-pages/narrative_and_worldbuilding/characters/characters.component';
import { EventsComponent } from 'src/app/pages/gdd-editor-pages/narrative_and_worldbuilding/events/events.component';
import { DocumentCoverComponent } from 'src/app/pages/gdd-editor-pages/document_cover/document-cover/document-cover.component';

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
    DocumentCoverComponent,
  ]
})

export class EditorLayoutModule {}
