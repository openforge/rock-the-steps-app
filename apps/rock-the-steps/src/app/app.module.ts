import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { PhaserSingletonService } from '@openforge/shared-phaser-singleton';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './home/home.page';
import { InternetConnectionFailComponent } from './network/internet-connection-fail/internet-connection-fail.component';
import { PlayStageComponent } from './play-stage/play-stage.component';
import { ResultScreenComponent } from './result-screen/result-screen.component';
import { DifficultSelectModalComponent } from './stage-select/difficult-select-modal/difficult-select-modal.component';
import { StageSelectComponent } from './stage-select/stage-select.component';

@NgModule({
    declarations: [AppComponent, HomePageComponent, StageSelectComponent, PlayStageComponent, DifficultSelectModalComponent, ResultScreenComponent, InternetConnectionFailComponent],
    imports: [BrowserModule, IonicModule.forRoot(), PhaserSingletonService.forRoot(), AppRoutingModule],
    providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
    bootstrap: [AppComponent],
})
export class AppModule {}
