import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes, RouterLinkActive} from '@angular/router';
import {CanvasComponent} from './canvas/canvas.component';
import {SettingsComponent} from './settings/settings.component';
import {FormsModule} from '@angular/forms';
import {LocalStorageModule} from 'angular-2-local-storage';
import {CanvasSettingsService} from './canvas-settings.service';
import {AppMaterialModule} from './app.material.module';
import 'materialize-css';
import {MaterializeModule} from 'angular2-materialize';
import {Ng2FileInputModule} from 'ng2-file-input';

const appRoutes: Routes = [
  {path: '', redirectTo: '/canvas', pathMatch: 'full'},
  {path: 'canvas', component: CanvasComponent},
  {path: 'settings', component: SettingsComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    CanvasComponent,
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterializeModule,
    AppMaterialModule,
    NoopAnimationsModule,
    RouterModule.forRoot(appRoutes),
    LocalStorageModule.withConfig({
      prefix: 'images-app',
      storageType: 'localStorage'
    }),
    Ng2FileInputModule.forRoot()
  ],
  providers: [CanvasSettingsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
