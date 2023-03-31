import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { AppComponent } from './app.component';
import { EditorLayoutComponent } from './layouts/editor-layout/editor-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { GddSetupLayoutComponent } from './layouts/gdd-setup-layout/gdd-setup-layout.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BasicInfoComponent } from './pages/gdd-editor-pages/basic-info/basic-info.component';
import { DragDropModule } from '@angular/cdk/drag-drop';


@NgModule({
  imports: [
    FontAwesomeModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    DragDropModule,
  ],
  declarations: [
    AppComponent,
    EditorLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    GddSetupLayoutComponent,
    BasicInfoComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }