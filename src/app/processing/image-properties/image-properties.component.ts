import { Component, OnInit, Input } from '@angular/core';
import { Freeman } from '../canvas/drawing-sources/freeman';

@Component({
  selector: 'app-image-properties',
  templateUrl: './image-properties.component.html',
  styleUrls: ['./image-properties.component.css']
})
export class ImagePropertiesComponent implements OnInit {

  private _freeman: Freeman;

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
