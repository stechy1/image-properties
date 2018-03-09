import { Component, OnInit } from '@angular/core';
import { Freeman } from './canvas/drawing-sources/freeman';

@Component({
  selector: 'app-processing',
  templateUrl: './processing.component.html',
  styleUrls: ['./processing.component.css']
})
export class ProcessingComponent implements OnInit {

  public freeman: Freeman;

  constructor() { }

  ngOnInit() {
  }

  onFreemanChanged(e: Freeman) {
    this.freeman = e;
  }

}
