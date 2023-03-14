import { Routes } from '@angular/router';

import { VditorComponent } from "../../pages/gdd-editor-pages/vditor/vditor.component";
import { AestheticsComponent } from 'src/app/pages/gdd-editor-pages/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/coreMechanic/coreMechanic.component';

export const EditorLayoutRoutes: Routes = [
    { path: 'theme', component: VditorComponent, data: {section: "High Level Design", subSection: "Theme"} },
    { path: 'aesthetics', component: AestheticsComponent },
    { path: 'coreMechanic', component: CoreMechanicComponent },
];
