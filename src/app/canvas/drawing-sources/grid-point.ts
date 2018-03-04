import * as p5 from 'p5';
import {Drawer} from './drawer';

export class GridPoint {

  private _coord: p5.Vector;
  private _borders: Array<number>;
  private _visualization: string;
  private _value: number;

  constructor(x: number, y: number) {
    this._coord = new p5.Vector(x, y);
    this._borders = [];
    this._visualization = '';
    this._value = -1;
  }

  draw(drawer: Drawer): void {
    drawer.drawStrike(this._coord.x, this._coord.y);
    if (this._borders.length !== 0) {
      drawer.push();
      drawer.strokeWeight(2);
      drawer.stroke('red');
      drawer.highlightBorder(this._coord.x, this._coord.y, this._borders);
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

  get x(): number {
    return this._coord.x;
  }

  get y(): number {
    return this._coord.y;
  }

  get value(): number {
    return this._value;
  }
}
