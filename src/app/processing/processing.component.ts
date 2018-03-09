import { Component, OnInit } from '@angular/core';
import { Freeman } from './canvas/drawing-sources/freeman';
import {Grid} from './canvas/drawing-sources/grid';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {

  private _freeman: Freeman;
  private _grid: Grid;

  constructor() { }

  ngOnInit() {
  }

  get freeman(): Freeman {
    return this._freeman;
  }

  get grid(): Grid {
    return this._grid;
  }

  onFreemanChanged(e: Freeman) {
    this._freeman = e;
  }

  onGridChanged(e: Grid) {
    this._grid = e;
  }
}
