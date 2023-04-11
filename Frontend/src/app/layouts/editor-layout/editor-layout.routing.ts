import { Routes } from '@angular/router';

import { VditorComponent } from "../../pages/gdd-editor-pages/vditor/vditor.component";
import { AestheticsComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/aesthetics/aesthetics.component';
import { CoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/high_level_design/coreMechanic/coreMechanic.component';
import { CharactersComponent } from 'src/app/pages/gdd-editor-pages/narrative_and_worldbuilding/characters/characters.component';
import { BasicInfoComponent } from 'src/app/pages/gdd-editor-pages/basic-info/basic-info.component';
import { DetailCoreMechanicComponent } from 'src/app/pages/gdd-editor-pages/low_level_design/detail_core_mechanic/detail_core_mechanic.component';
import { EventsComponent } from 'src/app/pages/gdd-editor-pages/narrative_and_worldbuilding/events/events.component';
import { DocumentCoverComponent } from 'src/app/pages/gdd-editor-pages/document_cover/document-cover/document-cover.component';
import { CoreGameplayLoopComponent } from 'src/app/pages/gdd-editor-pages/low_level_design/coreGameplayLoop/core_gameplay_loop.component';
import { TechnicalInfoComponent } from 'src/app/pages/gdd-editor-pages/technical-info/technical-info.component';

export const EditorLayoutRoutes: Routes = [
    { path: 'cover', component: DocumentCoverComponent, data: {section: "Document Cover", subSection: "Document Cover"}},
    { path: 'basicInfo', component: BasicInfoComponent, data: {section: "Basic Information", subSection: "Basic Information"} },
    { path: 'techInfo', component: TechnicalInfoComponent, data: {section: "Technical Information", subSection: "Technical Information"} },
    { path: 'theme', component: VditorComponent, data: {section: "High Level Design", subSection: "Theme"} },
    { path: 'aesthetics', component: AestheticsComponent, data: {section: "High Level Design", subSection: "Aesthetics"} },
    { path: 'coreMechanic', component: CoreMechanicComponent, data: {section: "High Level Design", subSection: "Core Mechanic Diagram"} },
    { path: 'detailCoreMechanic', component: DetailCoreMechanicComponent, data: {section: "Low Level Design", subSection: "Detail of the Core Mechanic"} },
    { path: 'coreGameplayLoop', component: CoreGameplayLoopComponent, data: {section: "Low Level Design", subSection: "Core Gameplay Loop"} },
    { path: 'characters', component: CharactersComponent, data: {section: "Narrative and Worldbuilding", subSection: "Characters"} },
    { path: 'events', component: EventsComponent, data: {section: "Narrative and Worldbuilding", subSection: "Events"} },
];
