import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home/home.page';
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
