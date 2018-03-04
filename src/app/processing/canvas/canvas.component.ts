import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { CanvasSettingsService } from './../../canvas-settings.service';
import * as p5provider from './drawing-sources/p5provider';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  private _p5: any;

  constructor(private _settings: CanvasSettingsService) {}

  ngOnInit() {
    this._p5 = p5provider.setupP5(this._settings.cols, this._settings.rows, this._settings.spacing, this._settings.coordinates,
      this._settings.direction);

    window.onunload = () => {
      if (this._settings.saveCanvasContent) {
        this._settings.canvasContent = JSON.stringify(this._p5.getCanvasStructure());
      }
    };
  }

  ngAfterViewInit() {
    if (this._settings.saveCanvasContent) {
      this._p5.loadGrid(JSON.parse(this._settings.canvasContent));
    }
  }

  ngOnDestroy() {
    if (this._settings.saveCanvasContent) {
      this._settings.canvasContent = JSON.stringify(this._p5.getCanvasStructure());
    }
  }

  handleClear() {
    this._p5.clearCanvas();
  }

  handleLoad(event: any) {
    const file = event.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        const data = JSON.parse(content);
        this._p5.loadGrid(data);
      };
      reader.readAsText(file);
    }
  }

  handleSave() {
    this._p5.saveJSON(this._p5.getCanvasStructure().reverse(), 'points.json');
  }

  handleScreenshot() {
    this._p5.takeScreenshot();
  }

  handleFindBorders() {
    this._p5.findBorders();
  }
}
