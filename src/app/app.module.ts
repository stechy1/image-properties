import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes, RouterLinkActive } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { ProcessingComponent } from './processing/processing.component';
import { CanvasComponent } from './processing/canvas/canvas.component';
import { SettingsComponent } from './settings/settings.component';
import { CanvasSettingsService } from './canvas-settings.service';


import { LocalStorageModule } from 'angular-2-local-storage';
import { AppMaterialModule } from './app.material.module';
import 'materialize-css';
import { MaterializeModule } from 'angular2-materialize';
import { Ng2FileInputModule } from 'ng2-file-input';



const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ProcessingComponent },
  { path: 'settings', component: SettingsComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    ProcessingComponent,
    CanvasComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
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
