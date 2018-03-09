import { Component, OnInit, Input } from '@angular/core';
import { Freeman } from '../canvas/drawing-sources/freeman';
import {Grid} from '../canvas/drawing-sources/grid';

@Component({
  selector: 'app-image-properties',
  templateUrl: './image-properties.component.html',
  styleUrls: ['./image-properties.component.css']
})
export class ImagePropertiesComponent implements OnInit {

  private _freeman: Freeman;
  private _grid: Grid;

  @Input()
  set grid(value: Grid) {
    this._grid = value;
  }

  get grid(): Grid {
    return this._grid;
  }

  @Input()
  set freeman(freeman: Freeman) {
    this._freeman = freeman;
  }

  get freeman(): Freeman {
    return this._freeman;
  }


  constructor() { }

  ngOnInit() {
  }

}
