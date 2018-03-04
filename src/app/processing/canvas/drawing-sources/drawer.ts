import * as p5 from 'p5';
import {Direction4} from './direction';

export class Drawer {
  private _graphic: p5;
  private _gapSize: number;
  private _shapePadding: number;
  private _smallRasterCount: number;
  private _smallRasterGapSize: number;
  private _canvasWidth: number;
  private _canvasHeight: number;

  constructor(graphic: p5, gapSize: number, canvasWidth: number, canvasHeight: number) {
    this._graphic = graphic;
    this._gapSize = gapSize;
    this._shapePadding = 5;
    this._smallRasterCount = 5;
    this._smallRasterGapSize = gapSize / this._smallRasterCount;
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;
  }

  getPoint(col, row, useShapePadding = false): {
    x: number, y: number
    , topLeft: {x: number, y: number}
    , topRight: {x: number, y: number}
    , bottomLeft: {x: number, y: number}
    , bottomRight: {x: number, y: number}
  } {
    return {
      x: (col * this._gapSize) + this._gapSize / 2,
      y: (row * this._gapSize) + this._gapSize / 2,
      topLeft: {
        x: col * this._gapSize + ((useShapePadding) ? this._shapePadding : 0),
        y: row * this._gapSize + ((useShapePadding) ? this._shapePadding : 0)
      },
      topRight: {
        x: col * this._gapSize + this._gapSize - ((useShapePadding) ? this._shapePadding : 0),
        y: row * this._gapSize + ((useShapePadding) ? this._shapePadding : 0)
      },
      bottomLeft: {
        x: col * this._gapSize + ((useShapePadding) ? this._shapePadding : 0),
        y: row * this._gapSize + this._gapSize - ((useShapePadding) ? this._shapePadding : 0)
      },
      bottomRight: {
        x: col * this._gapSize + this._gapSize - ((useShapePadding) ? this._shapePadding : 0),
        y: row * this._gapSize + this._gapSize - ((useShapePadding) ? this._shapePadding : 0)
      }
    };
  }

  drawPoint(col: number, row: number) {
    const point = this.getPoint(col, row, true);
    this._graphic.push();

    this._graphic.strokeWeight(3);
    this._graphic.point(point.x, point.y);

    this._graphic.pop();
  }

  drawLine(pointStart: p5.Vector, pointEnd: p5.Vector) {
    this._graphic.line(pointStart.x, pointStart.y, pointEnd.x, pointEnd.y);
  }

  drawRect(col: number, row: number) {
    const point = this.getPoint(col, row, true);
    this._graphic.rect(point.topLeft.x, point.topLeft.y, this._gapSize, this._gapSize);
    this._graphic.pop();
  }

  drawCircle(col: number, row: number) {
    const point = this.getPoint(col, row, true);
    this._graphic.ellipse(point.x, point.y, this._gapSize - this._shapePadding);
  }

  drawStrike(col: number, row: number) {
    const point = this.getPoint(col, row, true);

    this.drawLine(point.topLeft, point.bottomRight);
    this.drawLine(point.bottomLeft, point.topRight);
  }

  drawRaster(col: number, row: number) {
    const point = this.getPoint(col, row);
    this._graphic.push();
    this._graphic.translate(point.topLeft.x, point.topLeft.y);

    for (let x = 0; x < this._smallRasterCount; x++) {
      this._graphic.line(x * this._smallRasterGapSize, 0, x * this._smallRasterGapSize, this._gapSize);
    }

    for (let y = 0; y < this._smallRasterCount; y++) {
      this._graphic.line(0, y * this._smallRasterGapSize, this._gapSize, y * this._smallRasterGapSize);
    }

    this._graphic.pop();
  }

  drawArrow(pointStart: p5.Vector, pointEnd: p5.Vector, offset = 10) {
    const multiplier = this._gapSize / (this._gapSize * 3);
    this.drawLine(pointStart, pointEnd);
    this._graphic.push();
    const angle = this._graphic.atan2(pointStart.y - pointEnd.y, pointStart.x - pointEnd.x);
    this._graphic.translate(pointEnd.x, pointEnd.y);
    this._graphic.rotate(angle - this._graphic.HALF_PI);
    this._graphic.triangle(-offset * multiplier, offset, offset * multiplier, offset, 0, -offset / 3);
    this._graphic.pop();
  }

  drawChar(ch: string, col: number, row: number) {
    const point = this.getPoint(col, row, true);
    this._graphic.text(ch, point.x - this._gapSize / 5, point.y + this._gapSize / 4);
  }

  drawCharRaw(ch: string, point: p5.Vector) {
    this._graphic.text(ch, point.x, point.y);
  }

  highlight(col: number, row: number) {
    const point = this.getPoint(col, row);
    this._graphic.push();
    this._graphic.fill(234, 222, 239);
    this._graphic.rect(point.topLeft.x, point.topLeft.y, this._gapSize, this._gapSize);
    this._graphic.pop();
  }

  highlightBorder(col: number, row: number, directions: Array<number>) {
    const point = this.getPoint(col, row);
    directions.forEach((direction) => {
      switch (direction) {
        case Direction4.RIGHT():
          this.drawLine(point.bottomRight, point.topRight);
          break;
        case Direction4.TOP():
          this.drawLine(point.topLeft, point.topRight);
          break;
        case Direction4.LEFT():
          this.drawLine(point.bottomLeft, point.topLeft);
          break;
        case Direction4.BOTTOM():
          this.drawLine(point.bottomLeft, point.bottomRight);
          break;
      }
    });
  }

  push(): void {
    this._graphic.push();
  }

  pop(): void {
    this._graphic.pop();
  }

  stroke(param: any): void {
    this._graphic.stroke(param);
  }

  strokeWeight(param: any): void {
    this._graphic.strokeWeight(param);
  }
}
