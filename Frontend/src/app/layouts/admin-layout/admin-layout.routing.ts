import { Routes } from '@angular/router';

import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { TablesComponent } from '../../pages/tables/tables.component';
import { GddEditorComponent } from 'src/app/pages/gdd-editor/gdd-editor.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'tables',         component: TablesComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'editor',     component: GddEditorComponent },
];
