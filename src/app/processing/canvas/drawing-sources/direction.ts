import { GridPoint } from "./grid-point";

export class Direction4 implements Direction {
  private _value: number;

  static RIGHT() {
    return 0;
  }

  static TOP() {
    return 1;
  }

  static LEFT() {
    return 2;
  }

  static BOTTOM() {
    return 3;
  }

  constructor(value = -1) {
    this._value = value === -1 ? Direction4.BOTTOM() : value;
  }

  goNext(): void {
    this._value = ((this._value + 3) % this.directions());
  }

  increaseValue(): void {
    this._value = ((this._value + 1) % this.directions());
  }

  getNextPoint(point: {col: number, row: number}): {col: number, row: number} {
    switch (this._value) {
      case 0:
        return {col: point.col + 1, row: point.row};
      case 1:
        return {col: point.col, row: point.row - 1};
      case 2:
        return {col: point.col - 1, row: point.row};
      case 3:
        return {col: point.col, row: point.row + 1};
    }
  }

  getDirectionBetween(first: GridPoint, second: GridPoint): number {
    if (first.col > second.col) {
      return Direction4.LEFT();
    }

    if (second.col > first.col) {
      return Direction4.RIGHT();
    }

    if (first.row > second.row) {
      return Direction4.TOP();
    }

    if (first.row < second.row) {
      return Direction4.BOTTOM();
    }

    // Tohle by nikdy nemělo nastat
    return -1;
  }

  directions(): number {
    return 4;
  }

  setDirection(direction: number): void {
    this._value = direction;
  }
}

export class Direction8 implements Direction {
  private _value: number;

  static RIGHT() {
    return 0;
  }

  static TOP_RIGHT() {
    return 1;
  }

  static TOP() {
    return 2;
  }

  static TOP_LEFT() {
    return 3;
  }

  static LEFT() {
    return 4;
  }

  static BOTTOM_LEFT() {
    return 5;
  }

  static BOTTOM() {
    return 6;
  }

  static BOTTOM_RIGHT() {
    return 7;
  }

  constructor(value = -1) {
    this._value = value === -1 ? Direction8.BOTTOM_RIGHT() : value;
  }

  goNext() {
    if ((this._value % 2) === 0) {
      // Hodnota je sudá
      this._value = ((this._value + 7) % this.directions());
    } else {
      // Hodnota je lichá
      this._value = ((this._value + 6) % this.directions());
    }
  }

  increaseValue(): void {
    this._value = ((this._value + 1) % this.directions());
  }

  getNextPoint(point: {col: number, row: number}): {col: number, row: number} {
    switch (this._value) {
      case 0:
        return {col: point.col + 1, row: point.row};
      case 1:
        return {col: point.col + 1, row: point.row - 1};
      case 2:
        return {col: point.col, row: point.row - 1};
      case 3:
        return {col: point.col - 1, row: point.row - 1};
      case 4:
        return {col: point.col - 1, row: point.row};
      case 5:
        return {col: point.col - 1, row: point.row + 1};
      case 6:
        return {col: point.col, row: point.row + 1};
      case 7:
        return {col: point.col + 1, row: point.row + 1};
    }
  }

  getDirectionBetween(first: GridPoint, second: GridPoint): number {
    if (first.col > second.col) {
      if (first.row < second.row) {
        return Direction8.BOTTOM_LEFT();
      }

      if (first.row > second.row) {
        return Direction8.TOP_LEFT();
      }

      return Direction8.LEFT();
    }

    if (second.col > first.col) {
      if (first.row < second.row) {
        return Direction8.BOTTOM_RIGHT();
      }

      if (first.row > second.row) {
        return Direction8.TOP_RIGHT();
      }

      return Direction8.RIGHT();
    }

    // V tomto případě se již X-ové souřadnice musejí rovnat
    if (first.row > second.row) {
      return Direction8.TOP();
    }

    if (first.row < second.row) {
      return Direction8.BOTTOM();
    }

    // Tohle by nikdy nemělo nastat
    return -1;
  }

  directions(): number {
    return 8;
  }

  setDirection(direction: number): void {
    this._value = direction;
  }
}

export interface Direction {
  goNext(): void;
  increaseValue(): void;
  getNextPoint(point: {col: number, row: number}): {col: number, row: number};
  getDirectionBetween(first: GridPoint, second: GridPoint): number;
  directions(): number;
  setDirection(direction: number): void;
}

export class DirectionBuilder {
  static from(directionCount, value = -1) {
    switch (directionCount) {
      case 4:
        return new Direction4(value);
      case 8:
        return new Direction8(value);
    }
  }
}
