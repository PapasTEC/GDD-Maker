import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';
import { EditorLayoutRoutes } from './editor-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { VditorComponent } from "../../pages/gdd-editor-pages/vditor/vditor.component";
import { AestheticsComponent } from 'src/app/pages/gdd-editor-pages/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/coreMechanic/coreMechanic.component';

@NgModule({
  imports: [
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
  ]
})

export class EditorLayoutModule {}
