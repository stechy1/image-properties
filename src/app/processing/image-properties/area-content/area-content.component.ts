import {Component, Input, OnInit} from '@angular/core';
import {Grid} from '../../canvas/drawing-sources/grid';
import {Freeman} from '../../canvas/drawing-sources/freeman';
import {GridPoint} from '../../canvas/drawing-sources/grid-point';

@Component({
  selector: 'app-area-content',
  templateUrl: './area-content.component.html',
  styleUrls: ['./area-content.component.css']
})
export class AreaContentComponent implements OnInit {

  private _grid: Grid;
  private _freeman: Freeman;
  private _equationIndex: number;
  private _result = 0;

  public equationOptions = [
    {value: 0, viewValue: 'AR1'},
    {value: 1, viewValue: 'AR2'}
  ];

  constructor() { }

  private _ar1() {
    this._freeman.createBorderPointArray(this._grid.points)
      .then(border => {
        const points = this._grid.points;
        const promises = [];
        for (let col = 0; col < points.length; col++) {
          const cols = points[col];
          for (let row = 0; row < cols.length; row++) {
            const element = cols[row];
            promises.push(element.isInPolygon(border));
          }
        }

        return Promise.all(promises)
          .then((resultArray: Array<number>) => {
            return new Promise(resolve => {
              if (resultArray.length === 0) {
                resolve(0);
              }

              resolve(resultArray.reduce((a, b) =>  a + b));
            });
          });

      })
      .then((sum: number) => {
        this._result = sum;
      });
  }

  private _ar2() {
    this._freeman.createBorderPointArray(this._grid.points)
      .then((border: Array<GridPoint>) => {
        return new Promise(resolve => {
          let sum = 0;
          border.push(border[0]);
          for (let i = 1; i < border.length - 1; i++) {
            const pointCurrent = border[i];
            const pointNext = border[i + 1];
            sum += (pointNext.col - pointCurrent.col) * (pointNext.row + pointCurrent.row);
          }
          sum /= 2.0;

          resolve(sum);
        });
      })
      .then((sum: number) => {
        this._result = sum;
    });
  }

  @Input()
  set grid(value: Grid) {
    this._grid = value;
  }

  @Input()
  set freeman(freeman) {
    this._freeman = freeman;
  }

  set equationIndex(value: number) {
    this._equationIndex = value;
    switch (this._equationIndex) {
      case 0:
        this._ar1();
        break;
      case 1:
        this._ar2();
    }
  }

  get result(): number {
    return this._result;
  }

  ngOnInit() {}

  handleTest() {
    this._freeman.createBorderPointArray(this._grid.points)
      .then((border) => {
        const point = this._grid.points[5][5];
        return point.isInPolygon(border);
      })
      .then((isInPolygon) => {
        console.log(isInPolygon);
      });
  }
}
