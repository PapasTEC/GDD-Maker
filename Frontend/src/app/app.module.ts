import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { AppComponent } from "./app.component";
import { EditorLayoutComponent } from "./layouts/editor-layout/editor-layout.component";
import { AuthLayoutComponent } from "./layouts/auth-layout/auth-layout.component";
import { DashboardLayoutComponent } from "./layouts/dashboard-layout/dashboard-layout.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";
import { GddSetupLayoutComponent } from "./layouts/gdd-setup-layout/gdd-setup-layout.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { DragDropModule } from "@angular/cdk/drag-drop";
import * as dotenv from "dotenv";
import { JwtInterceptorInterceptor } from "./token/jwt-interceptor.interceptor";
import { ShareDocumentComponent } from "./components/share-document/share-document.component";

import { ToastrModule } from "ngx-toastr";
import { DocumentNotFoundComponent } from "./pages/document-not-found/document-not-found.component";
import { DocumentAccessDeniedComponent } from "./pages/document-access-denied/document-access-denied.component";
import { ClipboardModule } from "@angular/cdk/clipboard";

@NgModule({
  imports: [
    FontAwesomeModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: "toast-bottom-center",
    }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    NgbModule,
    RouterModule,
    AppRoutingModule,
    MatDialogModule,
    ClipboardModule,
  ],
  declarations: [
    AppComponent,
    EditorLayoutComponent,
    AuthLayoutComponent,
    DashboardLayoutComponent,
    GddSetupLayoutComponent,
    DocumentNotFoundComponent,
    DocumentAccessDeniedComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
