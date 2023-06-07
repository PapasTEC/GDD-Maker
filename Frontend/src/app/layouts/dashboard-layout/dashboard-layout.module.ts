import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DashboardLayoutRoutes } from "./dashboard-layout.routing";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { CountryPipe } from "../../pages/dashboard/project.pipe";
import { SortableHeaderDirective } from "../../pages/dashboard/sortable.header.directive";

import { DashboardComponent } from "../../pages/dashboard/dashboard.component";
import { UserProfileComponent } from "../../pages/user-profile/user-profile.component";
import { ComponentsModule } from "src/app/components/components.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    ComponentsModule,
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    CountryPipe,
    SortableHeaderDirective,
  ],
})
export class DashboardLayoutModule {}
