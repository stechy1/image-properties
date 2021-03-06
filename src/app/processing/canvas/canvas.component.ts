import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import * as FileSaver from 'file-saver';
import { CanvasSettingsService } from '../../canvas-settings.service';
import { Drawer } from './drawing-sources/drawer';
import { Grid } from './drawing-sources/grid';
import { Freeman } from './drawing-sources/freeman';
import { BorderWriter, BorderFinder } from './drawing-sources/border-worker';
import { DirectionBuilder } from './drawing-sources/direction';


@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css']
})
export class CanvasComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('my_canvas')
  private _canvas: ElementRef;
  private _grid: Grid;
  private freeman: Freeman;

  @Output() freemanChanged: EventEmitter<Freeman> = new EventEmitter();
  @Output() gridChanged: EventEmitter<Grid> = new EventEmitter<Grid>();

  constructor(private _settings: CanvasSettingsService) {
    this.freeman = null;
  }

  _mousePosRelative(event: MouseEvent): { x: number, y: number } {
    const rect = this._canvas.nativeElement.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  _redrawCanvas(): void {
    this._grid.drawer.push();

    this._grid.showGrid();
    if (this.freeman) {
      this.freeman.draw(this._grid);
    }

    this._grid.drawer.pop();
  }

  ngOnInit() {
    const drawer = new Drawer(this._canvas.nativeElement.getContext('2d'));
    this._grid = new Grid(drawer, this._settings.cols, this._settings.rows, this._settings.spacing);
    this._canvas.nativeElement.width = this._grid.canvasWidth;
    this._canvas.nativeElement.height = this._grid.canvasHeight;

    window.onunload = () => {
      if (this._settings.saveCanvasContent) {
        this._settings.canvasContent = JSON.stringify(this._grid.savePoints());
      }
    };
  }

  ngAfterViewInit() {
    if (this._settings.saveCanvasContent) {
      this._grid.loadPoints(JSON.parse(this._settings.canvasContent));
    }
    this._redrawCanvas();
    this.gridChanged.emit(this._grid);
  }

  ngOnDestroy() {
    if (this._settings.saveCanvasContent) {
      this._settings.canvasContent = JSON.stringify(this._grid.savePoints());
    }
  }

  handleClear() {
    this.freeman = null;
    this._grid._prepareGrid();
    this._redrawCanvas();
    this.gridChanged.emit(this._grid);
  }

  handleLoad(event: any) {
    const file = event.file;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const content = e.target.result;
        const data = JSON.parse(content);
        this._grid.loadPoints(data);
        this._redrawCanvas();
        this.gridChanged.emit(this._grid);
      };
      reader.readAsText(file);
    }
  }

  handleSave() {
    const blob = new Blob([JSON.stringify(this._grid.savePoints())]);
    FileSaver.saveAs(blob, 'grid.json');
  }

  handleScreenshot() {
    // TODO implementovat funkci pro stažení obrázku v canvasu
  }

  handleFindBorders() {
    const direction = DirectionBuilder.from(this._settings.direction);
    const borderFinder = new BorderFinder(this._grid.points, direction);
    const borderVisualizer = new BorderWriter(borderFinder.computeBorder(), this._grid.points, direction);
    borderVisualizer.write();
    this.freeman = new Freeman(borderFinder.startPoint, borderVisualizer.freeman, direction.directions());
    this._redrawCanvas();
    this.gridChanged.emit(this._grid);
    this.freemanChanged.emit(this.freeman);
  }

  handleClick(e: MouseEvent) {
    const coord = this._mousePosRelative(e);
    if (this._grid.isMouseInGridmouse(coord)) {
      const point = this._grid.mouseToPoint(coord);
      this._grid.togglePoint(point);
      this._redrawCanvas();
      this.gridChanged.emit(this._grid);
    }
  }

  handleMove(e: MouseEvent): void {
    const coord = this._mousePosRelative(e);
    if (this._grid.isMouseInGridmouse(coord)) {
      this._grid.highlighted = this._grid.mouseToPoint(coord);
      this._redrawCanvas();
    }
  }

  handleLeave(): void {
    this._grid.highlighted = null;
    this._redrawCanvas();
  }
}
