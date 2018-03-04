import * as p5 from 'p5';
import {GridPoint} from './grid-point';
import {Direction, DirectionBuilder} from './direction';
import {Drawer} from './drawer';

export class Freeman {
  private _startPoint: GridPoint|any;
  private _path: Array<number>;
  private _directionCount: number;
  private _direction: Direction;

  static fromJSON(json: any): Freeman {
    const startPoint = json.start;
    const path = json.path;
    const directionCount = json.directionCount;

    return new Freeman(startPoint, path, directionCount);
  }

  static empty(): Freeman {
    return new Freeman(new GridPoint(0, 0), [], 4);
  }

  
  constructor(startPoint: GridPoint, path: Array<number>, directionCount: number) {
    this._startPoint = startPoint;
    this._path = path;
    this._directionCount = directionCount;
    this._direction = DirectionBuilder.from(directionCount);
    console.log(startPoint);
    console.log(path);
  }

  serialize(): {directionCount: number, start: {x: number, y: number}, path: Array<number>} {
    return {
      directionCount: this._directionCount,
      start: {
        x: this._startPoint.x,
        y: this._startPoint.y
      },
      path: this._path
    };
  }

  writePointsToGrid(grid: GridPoint[][]): void {
    const direction = DirectionBuilder.from(this._directionCount, this.path[0]);
    let next = this._startPoint;
    grid[this.startPoint.x][this.startPoint.y].setPoint();
    for (let i = 1; i < this._path.length; i++) {
      const element = this._path[i];
      next = direction.getNextPoint(next);
      grid[next.x][next.y].setPoint();
      direction.setDirection(element);
    }
  }

  draw(graphic: Drawer): void {
    if (this._path.length === 0) {
      return;
    }

    let last = this._startPoint;
    graphic.drawArrow(graphic.getPoint(last.x, last.y - 1), graphic.getPoint(last.x, last.y));
    for (let i = 0; i < this._path.length; i++) {
      const direction = this._path[i];
      this._direction.setDirection(direction);
      const nextPoint = this._direction.getNextPoint(last);
      graphic.drawArrow(graphic.getPoint(last.x, last.y), graphic.getPoint(nextPoint.x, nextPoint.y));
      last = nextPoint;
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
