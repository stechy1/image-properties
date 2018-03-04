import {AfterContentInit, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {CanvasSettingsService} from '../canvas-settings.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {

  cols = new FormControl('', [Validators.required]);

  dirs = [
    {value: 4, viewValue: '4 - okolí'},
    {value: 8, viewValue: '8 - okolí'}
  ];

  constructor(public settings: CanvasSettingsService, public snackbar: MatSnackBar) {
    settings.settingsChanged.subscribe(() => {
      this.snackbar.open('Nastavení bylo uloženo', null, {duration: 1000});
    });
  }

  _aproximate(x: number): number {
    return 0.2098253 * x + 204.7854;
  }

  handleAutoScale() {
    const w = window.outerWidth;
    console.log(w);
    const cols = this.settings.cols;
    const canvasWidth = this._aproximate(w);
    console.log(canvasWidth);
    this.settings.spacing = Math.round(canvasWidth / cols);
  }
}
