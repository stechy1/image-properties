import * as p5 from 'p5';
import {GridPoint} from './grid-point';
import {Drawer} from './drawer';
import {Freeman} from './freeman';

export class Playground {
  private _colCount: number;
  private _rowCount: number;
  private _gapSize: number;
  private _canvasWidth: number;
  private _canvasHeight: number;
  private _showCoordinates: boolean;
  private _graphic: p5;
  private _grid: GridPoint[][];
  private _drawer: Drawer;
  private _highlighted: {col: number, row: number};

  constructor(graphic: p5, colCount: number, rowCount: number, gapSize: number, canvasWidth: number, canvasHeight: number,
              showCoordinates: boolean) {
    this._colCount = colCount;
    this._rowCount = rowCount;
    this._gapSize = gapSize;
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;
    this._showCoordinates = showCoordinates;
    this._graphic = graphic;
    this._grid = [];
    this._drawer = new Drawer(graphic, this._gapSize, canvasWidth, canvasHeight);
    this._highlighted = null;
  }

  prepareGrid(): void {
    for (let col = 0; col < this._colCount; col++) {
      this._grid[col] = [];
      for (let row = 0; row < this._rowCount; row++) {
        this._grid[col][row] = new GridPoint(col, row);
      }
    }
  }

  _showHorizontalLines(): void {
    for (let row = 0; row <= this._rowCount; row++) {
      const pointY = row * this._gapSize;
      this._drawer.drawLine({x: 0, y: pointY}, {x: this._canvasWidth, y: pointY});

      if (this._showCoordinates) {
        this._drawer.drawCharRaw('' + row, {x: -this._gapSize, y: pointY + this._gapSize / 2 + this._gapSize / 4});
      }
    }
  }

  _showVerticalLines(): void {
    for (let col = 0; col <= this._colCount; col++) {
      const pointX = col * this._gapSize;
      this._drawer.drawLine({x: pointX, y: 0}, {x: pointX, y: this._canvasHeight});

      if (this._showCoordinates) {
        this._drawer.drawCharRaw('' + col, {x: pointX + this._gapSize / 5, y: -this._gapSize / 4});
      }
    }
  }

  showGrid(): void {
    if (this._showCoordinates) {
      this._graphic.translate(this._gapSize, this._gapSize);
    }

    this._showHorizontalLines();
    this._showVerticalLines();
  }

  showPoints(): void {
    if (this._highlighted != null) {
      this._drawer.highlight(this._highlighted.col, this._highlighted.row);
    }

    for (let i = 0; i < this._colCount; i++) {
      for (let j = 0; j < this._rowCount; j++) {
        const gridPoint = this._grid[i][j];
        if (gridPoint.value === 1) {
          gridPoint.draw(this._drawer);
        }
      }
    }
  }

  highlight(point: {col: number, row: number}) {
    this._highlighted = point;
  }

  togglePoint(point: {col: number, row: number}): void {
    this._grid[point.col][point.row].togglePoint();
  }

  loadPoints(points: any): void {
    this.clearPlayground();
    points.forEach((point) => {
      this.togglePoint(point);
    });
  }

  savePoints(): Array<{col: number, row: number}> {
    const points = [];
    for (let col = 0; col < this._colCount; col++) {
      for (let row = 0; row < this._rowCount; row++) {
        const gridPoint = this._grid[col][row];
        if (gridPoint.value === 1) {
          points.push({col: gridPoint.x, row: gridPoint.y});
        }
      }
    }

    return points;
  }

  clearPlayground(): void {
    for (let col = 0; col < this._colCount; col++) {
      for (let row = 0; row < this._rowCount; row++) {
        const gridPoint = this._grid[col][row];
        gridPoint.reset();
      }
    }
  }

  isClickInPlayground(): boolean {
    const minX = this._showCoordinates ? this._gapSize : 0;
    const minY = this._showCoordinates ? this._gapSize : 0;
    return this._graphic.mouseX >= minX && this._graphic.mouseX <= this._canvasWidth
      && this._graphic.mouseY >= minY && this._graphic.mouseY <= this._canvasHeight;
  }

  mouseToPoint(): {col: number, row: number} {
    const point = {
      col: this._graphic.floor(this._graphic.mouseX / this._gapSize),
      row: this._graphic.floor(this._graphic.mouseY / this._gapSize)
    };

    if (this._showCoordinates) {
      point.col -= 1;
      point.row -= 1;
    }

    return point;
  }

  get grid(): GridPoint[][] {
    return this._grid;
  }

  get drawer(): Drawer {
    return this._drawer;
  }
}
