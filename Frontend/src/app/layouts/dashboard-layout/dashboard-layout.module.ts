import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardLayoutRoutes } from './dashboard-layout.routing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(DashboardLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    DashboardComponent
  ]
})
export class DashboardLayoutModule { }
