import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Freeman } from '../../canvas/drawing-sources/freeman';
import {Grid} from '../../canvas/drawing-sources/grid';

@Component({
  selector: 'app-area-circumference',
  templateUrl: './area-circumference.component.html',
  styleUrls: ['./area-circumference.component.css']
})
export class AreaCircumferenceComponent implements OnInit {

  public equationOptions = [
    {value: 0, viewValue: 'Vlastní'},
    {value: 1, viewValue: 'L(n) = a*n'},
    {value: 2, viewValue: 'L(ne, no) = a*ne + b*no'},
    {value: 3, viewValue: 'L(ne, no, nc) = a*ne + b*no + c*nc'},
  ];

  private _grid: Grid;
  private _freeman: Freeman;

  private _circumModel: CircumferenceModel = new CircumferenceModel();
  private _result = 0;

  constructor() { }

  ngOnInit() {
    this._circumModel.coefChange.subscribe(() => {
      const even = this._freeman.evenDirections;
      const odd = this._freeman.oddDirections;
      const corner = this._freeman.cornerDirections;
      const length = this._freeman.pathSize;
      this._result = this._circumModel.calculate(length, even, odd, corner);
    });

    this._circumModel.rawFunction = CircumferenceModel.RAW_FUNCTION_SKELETON();
  }

  @Input()
  set grid(value: Grid) {
    this._grid = value;
  }

  @Input()
  set freeman(freeman) {
    this._freeman = freeman;
  }

  get circumModel(): CircumferenceModel {
    return this._circumModel;
  }

  get result(): number {
    return this._result;
  }

  handleModifiersFromFreeman() {
    this._circumModel.coefA = 1;
    this._circumModel.coefB = Math.sqrt(2);
    this._circumModel.coefC = 0;
  }

  handleModifiersFroMSmeulders() {
    this._circumModel.coefA = 0.948;
    this._circumModel.coefB = 1.343;
    this._circumModel.coefC = 0;
  }

  handleModifiersFromGroen() {
    this._circumModel.coefA = 1.059;
    this._circumModel.coefB = 1.183;
    this._circumModel.coefC = 0;
  }

  handleModifiersFromSix() {
    this._circumModel.coefA = 1;
    this._circumModel.coefB = Math.sqrt(2);
    this._circumModel.coefC = -0.089;
  }

  handleModifiersFroMSeven() {
    this._circumModel.coefA = 0.980;
    this._circumModel.coefB = 1.406;
    this._circumModel.coefC = 0.091;
  }
}

class CircumferenceModel {
  private _equationIndex;
  private _coefA = 0;
  private _coefB = 0;
  private _coefC = 0;
  private _rawFunction = '';

  coefChange: EventEmitter<any> = new EventEmitter();

  static RAW_FUNCTION_SKELETON(): string {
    return '(length, ne, no, nc) => {\n \t return -1; \n }';
  }

  get equationIndex(): number {
    return this._equationIndex;
  }

  set equationIndex(equationIndex) {
    this._equationIndex = equationIndex;
  }

  public get coefA(): number {
    return this._coefA;
  }

  public set coefA(value: number) {
    this._coefA = value;
    this.coefChange.emit();
  }

  public get coefB(): number {
    return this._coefB;
  }

  public set coefB(value: number) {
    this._coefB = value;
    this.coefChange.emit();
  }

  public get coefC(): number {
    return this._coefC;
  }

  public set coefC(value: number) {
    this._coefC = value;
    this.coefChange.emit();
  }

  get rawFunction(): string {
    return this._rawFunction;
  }

  set rawFunction(value: string) {
    this._rawFunction = value;
    this.coefChange.emit();
  }

  public calculate(length: number, ne: number, no: number, nc: number): number {
    switch (this._equationIndex) {
      case 0:
        let result = 0;
        try {
          const func = eval(this._rawFunction);
          result = func(length, ne, no, nc);
        } catch (ignore) {}

        return result;
      case 1:
        return length * (this._coefA || 0);
      default:
        return ne * (this._coefA || 0) + no * (this._coefB || 0) + nc * (this._coefC || 0);
    }
  }


}
