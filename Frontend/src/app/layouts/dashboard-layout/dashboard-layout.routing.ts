import { Routes } from '@angular/router';
import { UserProfileComponent } from 'src/app/pages/user-profile/user-profile.component';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

export const DashboardLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
];