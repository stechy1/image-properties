import {Grid} from './grid';
import { Direction, DirectionBuilder } from './direction';
import { Drawer } from './drawer';
import { GridPoint } from './grid-point';

export class Freeman {
  private _startPoint: GridPoint | any;
  private _path: Array<number>;
  private _directionCount: number;
  private _direction: Direction;

  static fromJSON(json: any): Freeman {
    const startPoint = json.start;
    const path = json.path;
    const directionCount = json.directionCount;

    return new Freeman(startPoint, path, directionCount);
  }

  constructor(startPoint: GridPoint, path: Array<number>, directionCount: number) {
    this._startPoint = startPoint;
    this._path = path;
    this._directionCount = directionCount;
    this._direction = DirectionBuilder.from(directionCount);
    console.log(startPoint);
    console.log(path);
  }

  serialize(): { directionCount: number, start: { x: number, y: number }, path: Array<number> } {
    return {
      directionCount: this._directionCount,
      start: {
        x: this._startPoint.col,
        y: this._startPoint.row
      },
      path: this._path
    };
  }

  writePointsToGrid(grid: GridPoint[][]): void {
    const direction = DirectionBuilder.from(this._directionCount, this.path[0]);
    let next = {col: this._startPoint.col, row: this._startPoint.row};
    grid[this.startPoint.col][this.startPoint.row].setPoint();
    for (let i = 1; i < this._path.length; i++) {
      const element = this._path[i];
      next = direction.getNextPoint(next);
      grid[next.col][next.row].setPoint();
      direction.setDirection(element);
    }
  }

  draw(grid: Grid): void {
    if (this._path.length === 0) {
      return;
    }

    let last = this._startPoint;
    grid.drawArrow({ col: last.col, row: last.row - 1 }, last);
    for (let i = 0; i < this._path.length; i++) {
      const direction = this._path[i];
      this._direction.setDirection(direction);
      const next = this._direction.getNextPoint(last);
      grid.drawArrow(last, next);
      last = next;
    }
  }

  get startPoint(): GridPoint {
    return this._startPoint;
  }

  get path(): Array<number> {
    return this._path;
  }

  get directionCount(): number {
    return this._directionCount;
  }

}
