import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { EditorLayoutComponent } from './layouts/editor-layout/editor-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { DashboardLayoutComponent } from './layouts/dashboard-layout/dashboard-layout.component';
import { GddSetupLayoutComponent } from 'src/app/layouts/gdd-setup-layout/gdd-setup-layout.component';

const routes: Routes =[
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  }, {
    path: '',
    component: EditorLayoutComponent,
    children: [
      {
        path: 'editor',
        loadChildren: () => import('src/app/layouts/editor-layout/editor-layout.module').then(m => m.EditorLayoutModule)
      }
    ]
  }, {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/auth-layout/auth-layout.module').then(m => m.AuthLayoutModule)
      }
    ]
  }, {
    path: '',
    component: DashboardLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/dashboard-layout/dashboard-layout.module').then(m => m.DashboardLayoutModule)
      }
    ]
  }, {
    path: 'setup',
    component: GddSetupLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('src/app/layouts/gdd-setup-layout/gdd-setup-layout.module').then(m => m.GDDSetupLayoutModule)
      }
    ]
  },
  
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
