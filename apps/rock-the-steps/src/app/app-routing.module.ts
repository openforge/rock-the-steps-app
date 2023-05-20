import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home/home.page';
import { PlayStageComponent } from './play-stage/play-stage.component';
import { ResultScreenComponent } from './result-screen/result-screen.component';
import { StageSelectComponent } from './stage-select/stage-select.component';

const routes: Routes = [
    {
        path: 'home',
        component: HomePageComponent,
    },

    {
        path: 'stage-select',
        component: StageSelectComponent,
    },
    {
        path: 'play-stage',
        component: PlayStageComponent,
    },
    {
        path: 'finish',
        component: ResultScreenComponent,
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
