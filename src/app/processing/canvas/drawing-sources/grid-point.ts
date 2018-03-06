import {Direction4} from './direction';
import { Drawer } from './drawer';

export class GridPoint {

  private _borders: Array<number>;
  private _visualization: string;
  private _value: number;

  constructor(private _col: number, private _row: number,
    private _rawCoordinates: {
      x: number, y: number
      , topLeft: { x: number, y: number }
      , topRight: { x: number, y: number }
      , bottomLeft: { x: number, y: number }
      , bottomRight: { x: number, y: number }
    }) {
    this._borders = [];
    this._visualization = '';
    this._value = -1;
  }

  _highlightBorder(drawer: Drawer): void {
    this._borders.forEach((direction) => {
        switch (direction) {
            case Direction4.RIGHT():
                drawer.drawLine(this._rawCoordinates.bottomRight, this._rawCoordinates.topRight);
                break;
            case Direction4.TOP():
                drawer.drawLine(this._rawCoordinates.topLeft, this._rawCoordinates.topRight);
                break;
            case Direction4.LEFT():
                drawer.drawLine(this._rawCoordinates.bottomLeft, this._rawCoordinates.topLeft);
                break;
            case Direction4.BOTTOM():
                drawer.drawLine(this._rawCoordinates.bottomLeft, this._rawCoordinates.bottomRight);
                break;
        }
    });
}

  draw(drawer: Drawer): void {
    drawer.drawLine(this._rawCoordinates.topLeft, this._rawCoordinates.bottomRight);
    drawer.drawLine(this._rawCoordinates.bottomLeft, this._rawCoordinates.topRight);

    if (this._borders.length !== 0) {
        drawer.push();
        drawer.lineWidth = 2;
        drawer.strokeStyle = 'red';
        this._highlightBorder(drawer);
        drawer.pop();
    }
  }

  clearBorders(): void {
    this._borders = [];
  }

  reset(): void {
    this.clearBorders();
    this._value = -1;
  }

  togglePoint(): void {
    this._value *= -1;
    console.log("Toggle to: " + this._value);
  }

  setPoint(): void {
    this._value = 1;
  }

  get borders(): Array<number> {
    return this._borders;
  }

  set borders(value: Array<number>) {
    this._borders = value;
  }

  get col(): number {
    return this._col;
  }

  get row(): number {
    return this._row;
  }

  get value(): number {
    return this._value;
  }

  get rawCoordinates(): {
    x: number, y: number
    , topLeft: { x: number, y: number }
    , topRight: { x: number, y: number }
    , bottomLeft: { x: number, y: number }
    , bottomRight: { x: number, y: number }
  } {
    return this._rawCoordinates;
  }
}
