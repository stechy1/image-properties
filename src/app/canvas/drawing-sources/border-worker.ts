import {GridPoint} from './grid-point';
import {Direction, Direction4} from './direction';
import {Freeman} from './freeman';

export class BorderFinder {
  private _grid: GridPoint[][];
  private _direction: Direction;
  private _cols: number;
  private _rows: number;
  private _start: GridPoint|null;

  static isPointEqual(first: GridPoint, second: GridPoint): boolean {
    return first.x === second.x && first.y === second.y;
  }

  constructor(grid: GridPoint[][], direction: Direction) {
    this._grid = grid;
    this._direction = direction;
    this._cols = grid.length;
    this._rows = grid[0].length;
    this._start = null;
  }

  _findFirstPoint(): GridPoint|null {
    for (let i = 0; i < this._grid.length; i++) {
      const col = this._grid[i];
      for (let j = 0; j < col.length; j++) {
        const element = col[j];
        if (element.value === 1) {
          return element;
        }
      }
    }

    return null;
  }

  _findNext(point): GridPoint|null {
    for (let i = 0; i < this._direction.directions(); i++) {
      const p = this._direction.getNextPoint(point);
      if (p.x >= 0 && p.x < this._cols && p.y >= 0 && p.y < this._rows) {
        const gridPoint = this._grid[p.x][p.y];
        if (gridPoint.value === 1) {
          this._direction.goNext();
          return gridPoint;
        }
      }
      this._direction.increaseValue();
    }

    return null;
  }

  computeBorder(): GridPoint[] {
    const border = [];
    this._start = this._findFirstPoint();
    let next = this._findNext(this._start);
    let counter = 0;
    border.push(this._start);
    while (next != null && !BorderFinder.isPointEqual(this._start, next) && counter < 100) {
      border.push(next);
      next = this._findNext(next);
      counter++;
    }

    return border;
  }

  get startPoint(): GridPoint|null {
    return this._start;
  }
}

export class BorderWriter {
  private _border: Array<GridPoint>;
  private _grid: GridPoint[][];
  private _cols: number;
  private _rows: number;
  private _direction: Direction;
  private _freeman: Array<number>;

  constructor(border: Array<GridPoint>, grid: GridPoint[][], direction: Direction) {
    this._border = border;
    this._grid = grid;
    this._cols = grid.length;
    this._rows = grid[0].length;
    this._direction = direction;
    this._freeman = [];
  }

  _getEmptyNeighbours(point): Array<number> {
    const neighbours = [];

    // Dívám se na souseda vpravo
    if (point.x > 0) {
      const neighbour = this._grid[point.x - 1][point.y];
      if (neighbour.value === -1) {
        neighbours.push(Direction4.LEFT());
      }
    } else {
      neighbours.push(Direction4.LEFT());
    }

    // Dívám se na souseda vlevo
    if (point.x < this._cols - 1) {
      const neighbour = this._grid[point.x + 1][point.y];
      if (neighbour.value === -1) {
        neighbours.push(Direction4.RIGHT());
      }
    } else {
      neighbours.push(Direction4.RIGHT());
    }

    // Dívám se na souseda nahoře
    if (point.y > 0) {
      const neighbour = this._grid[point.x][point.y - 1];
      if (neighbour.value === -1) {
        neighbours.push(Direction4.TOP());
      }
    } else {
      neighbours.push(Direction4.TOP());
    }

    // Dívám se na souseda dole
    if (point.y < this._rows - 1) {
      const neighbour = this._grid[point.x][point.y + 1];
      if (neighbour.value === -1) {
        neighbours.push(Direction4.BOTTOM());
      }
    } else {
      neighbours.push(Direction4.BOTTOM());
    }

    return neighbours;
  }

  write(): void {
    let last = this._border[0];
    let neighbours = this._getEmptyNeighbours(last);
    this._grid[last.x][last.y].borders = neighbours;

    for (let i = 1; i < this._border.length; i++) {
      const point = this._border[i];
      neighbours = this._getEmptyNeighbours(point);
      this._grid[point.x][point.y].borders = neighbours;

      this._freeman.push(this._direction.getDirectionBetween(last, point));

      last = point;
    }
  }

  get freeman(): Array<number> {
    return this._freeman;
  }
}
