import { Routes } from '@angular/router';

import { VditorComponent } from "../../pages/gdd-editor-pages/high_level_design/vditor/vditor.component";
import { AestheticsComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/coreMechanic/coreMechanic.component';

export const EditorLayoutRoutes: Routes = [
    { path: 'theme', component: VditorComponent, data: {section: "High Level Design", subSection: "Theme"} },
    { path: 'aesthetics', component: AestheticsComponent },
    { path: 'coreMechanic', component: CoreMechanicComponent },
];
