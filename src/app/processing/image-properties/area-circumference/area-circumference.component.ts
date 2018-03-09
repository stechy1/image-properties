import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Freeman } from '../../canvas/drawing-sources/freeman';

@Component({
  selector: 'app-area-circumference',
  templateUrl: './area-circumference.component.html',
  styleUrls: ['./area-circumference.component.css']
})
export class AreaCircumferenceComponent implements OnInit {

  equationOptions = [
    {value: 0, viewValue: "Vlastní"},
    {value: 1, viewValue: "L(n) = a*n"},
    {value: 2, viewValue: "L(ne, no) = a*ne + b*no"},
    {value: 3, viewValue: "L(ne, no, nc) = a*ne + b*no + c*nc"},
  ];

  _freeman: Freeman;

  private _equationIndex: number = 0;
  private _circumModel: CircumferenceModel = new CircumferenceModel();
  private _result: number = 0;

  constructor() { }

  ngOnInit() {
    this._circumModel.coefChange.subscribe(() => {
      const even = this._freeman.evenDirections;
      const odd = this._freeman.oddDirections;
      const corner = this._freeman.cornerDirections;
      this._result = this._circumModel.calculate(even, odd, corner);
    });
  }

  @Input()
  set freeman(freeman) {
    this._freeman = freeman;
  }

  get equationIndex(): number {
    return this._equationIndex;
  }

  set equationIndex(equationIndex) {
    this._equationIndex = equationIndex;
  }

  get circumModel(): CircumferenceModel {
    return this._circumModel;
  }

  get result(): number {
    return this._result;
  }

}

class CircumferenceModel {

  private _coefA: number = 0;
  private _coefB: number = 0;
  private _coefC: number = 0;

  coefChange: EventEmitter<any> = new EventEmitter();


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
  
  public calculate(ne: number, no: number, nc: number): number {
    return ne * (this._coefA || 0) + no * (this._coefB || 0) + nc * (this._coefC || 0);
  }
  

}