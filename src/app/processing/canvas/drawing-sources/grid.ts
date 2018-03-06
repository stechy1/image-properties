import { Direction4 } from "./direction";
import { Drawer } from "./drawer";
import { GridPoint } from "./grid-point";

export class Grid {

    private _shapePadding: number;
    private _smallRasterCount: number;
    private _smallRasterGapSize: number;
    private _showCoordinates: boolean;
    private _points: GridPoint[][];
    private _highlighted: { col: number, row: number } | null;
    private _canvasPadding = 8;

    constructor(private _drawer: Drawer, private _cols: number, private _rows: number, private _gapSize: number) {
        this._shapePadding = 5;
        this._smallRasterCount = 5;
        this._smallRasterGapSize = this._gapSize / this._smallRasterCount;
        this._showCoordinates = true;

        this._points = [];
        this._prepareGrid();
    }

    _prepareGrid(): void {
        for (let col = 0; col < this._cols; col++) {
            this._points[col] = [];
            for (let row = 0; row < this._rows; row++) {
                this._points[col][row] = new GridPoint(col, row, this._getPoint(col, row, false));
            }
        }
    }

    _getPoint(col, row, useShapePadding = false): {
        x: number, y: number
        , topLeft: { x: number, y: number }
        , topRight: { x: number, y: number }
        , bottomLeft: { x: number, y: number }
        , bottomRight: { x: number, y: number }
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

    _showHorizontalLines(): void {
        for (let row = 0; row <= this._rows; row++) {
            const pointY = row * this._gapSize;
            this._drawer.drawLine({ x: 0, y: pointY }, { x: this.canvasWidth, y: pointY });

            if (this._showCoordinates) {
                this._drawer.drawText('' + row, -this._gapSize, pointY + this._gapSize / 2 + this._gapSize / 4);
            }
        }
    }

    _showVerticalLines(): void {
        for (let col = 0; col <= this._cols; col++) {
            const pointX = col * this._gapSize;
            this._drawer.drawLine({ x: pointX, y: 0 }, { x: pointX, y: this.canvasHeight });

            if (this._showCoordinates) {
                //this._drawer.drawCharRaw('' + col, { x: pointX + this._gapSize / 5, y: -this._gapSize / 4 });
                this._drawer.drawText('' + col, pointX + this._gapSize / 5, -this._gapSize / 4);
            }
        }
    }

    _highlight(col: number, row: number): void {
        const point = this._getPoint(col, row);
        this._drawer.push();
        this._drawer.fillStyle = 'rgb(234, 222, 239)';
        this._drawer.fillRectangle(point.topLeft.x + 1, point.topLeft.y + 1, this._gapSize - 3, this._gapSize - 3);
        this._drawer.pop();
    }

    clear(): void {
        for (let col = 0; col < this._cols; col++) {
            for (let row = 0; row < this._rows; row++) {
                const gridPoint = this._points[col][row];
                gridPoint.reset();
            }
        }
    }

    showGrid(): void {
        this._drawer.clear();

        if (this._showCoordinates) {
            this._drawer.translate(this._gapSize, this._gapSize);
        }

        this._showHorizontalLines();
        this._showVerticalLines();

        if (this._highlighted != null) {
            this._highlight(this._highlighted.col, this._highlighted.row);
        }

        for (let col = 0; col < this._cols; col++) {
            for (let row = 0; row < this._rows; row++) {
                const gridPoint = this._points[col][row];
                if (gridPoint.value === 1) {
                    gridPoint.draw(this._drawer);
                }
            }
        }
    }

    drawArrow(from: {col: number, row: number}, to: {col: number, row: number}): void {
        console.log(from);
        console.log(to);
        const start = this._getPoint(from.col, from.row);
        const end = this._getPoint(to.col, to.row);
        this._drawer.drawArrow(start, end);

    }

    isMouseInGridmouse(mouse: { x: number, y: number }): boolean {
        const minX = (this._showCoordinates ? this._gapSize : 0);
        const minY = (this._showCoordinates ? this._gapSize : 0);
        return mouse.x >= minX
            && mouse.x <= (this.canvasWidth)
            && mouse.y >= minY
            && mouse.y <= (this.canvasHeight);
    }

    mouseToPoint(mouse: { x: number, y: number }): { col: number, row: number } {
        const point = {
            col: Math.floor((mouse.x / this._gapSize)),
            row: Math.floor((mouse.y / this._gapSize))
        };

        if (this._showCoordinates) {
            point.col -= 1;
            point.row -= 1;
        }

        return point;
    }

    togglePoint(point: { col: number, row: number }): void {
        this.points[point.col][point.row].togglePoint();
    }

    loadPoints(points: any): void {
        this.clear();
        points.forEach((point) => {
            this.togglePoint(point);
        });
    }

    savePoints(): Array<{ col: number, row: number }> {
        const points = [];
        for (let col = 0; col < this._cols; col++) {
            for (let row = 0; row < this._rows; row++) {
                const gridPoint = this._points[col][row];
                if (gridPoint.value === 1) {
                    points.push({ col: gridPoint.col, row: gridPoint.row });
                }
            }
        }

        return points;
    }

    get canvasWidth() {
        return this._rows * this._gapSize + (this._showCoordinates ? this._gapSize : 0) + 1;
    }

    get canvasHeight() {
        return this._cols * this._gapSize + (this._showCoordinates ? this._gapSize : 0) + 1;
    }

    get drawer(): Drawer {
        return this._drawer;
    }

    get showCoordinates(): boolean {
        return this._showCoordinates;
    }

    set showCoordinates(showCoordinates) {
        this._showCoordinates = showCoordinates;
    }

    get points(): GridPoint[][] {
        return this._points;
    }

    set highlighted(point: { col: number, row: number } | null) {
        this._highlighted = point;
    }

}