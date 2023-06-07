import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { TogglebarComponent } from "./togglebar/togglebar.component";
import { RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { EditorWorkspaceComponent } from "./editor-workspace/editor-workspace.component";
import { ShareDocumentComponent } from "./share-document/share-document.component";
import { FormsModule } from "@angular/forms";
import { LoadingScreenComponent } from "./loading-screen/loading-screen.component";
import { LoadingSectionComponent } from "./loading-section/loading-section.component";

@NgModule({
  imports: [CommonModule, RouterModule, NgbModule, FormsModule],
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TogglebarComponent,
    EditorWorkspaceComponent,
    ShareDocumentComponent,
    LoadingScreenComponent,
    LoadingSectionComponent,
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    TogglebarComponent,
    ShareDocumentComponent,
    LoadingScreenComponent,
    LoadingSectionComponent,
  ],
})
export class ComponentsModule {}
