import { Routes } from '@angular/router';

import { VditorComponent } from "../../pages/gdd-editor-pages/vditor/vditor.component";
import { AestheticsComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/coreMechanic/coreMechanic.component';
import { BasicInfoComponent } from 'src/app/pages/gdd-editor-pages/basic-info/basic-info.component';

export const EditorLayoutRoutes: Routes = [
    { path: 'basicInfo', component: BasicInfoComponent },
    { path: 'theme', component: VditorComponent, data: {section: "High Level Design", subSection: "Theme"} },
    { path: 'aesthetics', component: AestheticsComponent },
    { path: 'coreMechanic', component: CoreMechanicComponent },
];
