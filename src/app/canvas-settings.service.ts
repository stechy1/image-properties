import {EventEmitter, Injectable, Output} from '@angular/core';
import {LocalStorageService} from 'angular-2-local-storage';

@Injectable()
export class CanvasSettingsService {

  private _cols: number;
  private _rows: number;
  private _spacing: number;
  private _coordinates: boolean;
  private _direction: number;
  private _saveCanvasContent: boolean;

  constructor(private _localStorageService: LocalStorageService) {
    this._cols = this._localStorageService.get<number>('cols') || 10;
    this._rows = this._localStorageService.get<number>('rows') || 10;
    this._spacing = this._localStorageService.get<number>('spacing') || 20;
    this._coordinates = this._localStorageService.get<boolean>('coordinates');
    this._direction = this._localStorageService.get<number>('direction') || 4;
    this._saveCanvasContent = this._localStorageService.get<boolean>('saveCanvasContent');
  }

  @Output() settingsChanged: EventEmitter<SettingsEvent<any>> = new EventEmitter<SettingsEvent<any>>();

  set canvasContent(json: any) {
    this._localStorageService.set('canvasContent', json);
  }
  get canvasContent(): any {
    return this._localStorageService.get<string>('canvasContent');
  }

  set cols(value: number) {
    const oldValue = this._cols;
    this._cols = value;
    this._localStorageService.set('cols', this._cols);
    this.settingsChanged.emit(new SettingsEvent<number>('cols', oldValue, value));
  }
  get cols(): number {
    return this._cols;
  }

  get rows(): number {
    return this._rows;
  }
  set rows(value: number) {
    const oldValue = this._rows;
    this._rows = value;
    this._localStorageService.set('rows', this._rows);
    this.settingsChanged.emit(new SettingsEvent<number>('rows', oldValue, value));
  }

  get spacing(): number {
    return this._spacing;
  }
  set spacing(value: number) {
    const oldValue = this._spacing;
    this._spacing = value;
    this._localStorageService.set('spacing', this._spacing);
    this.settingsChanged.emit(new SettingsEvent<number>('spacing', oldValue, value));
  }

  get coordinates(): boolean {
    return this._coordinates;
  }
  set coordinates(value: boolean) {
    const oldValue = this._coordinates;
    this._coordinates = value;
    this._localStorageService.set('coordinates', this._coordinates);
    this.settingsChanged.emit(new SettingsEvent<boolean>('coordinates', oldValue, value));
  }

  get direction(): number {
    return this._direction;
  }
  set direction(value: number) {
    const oldValue = this._direction;
    this._direction = value;
    this._localStorageService.set('direction', this._direction);
    this.settingsChanged.emit(new SettingsEvent<number>('direction', oldValue, value));
  }

  get saveCanvasContent(): boolean {
    return this._saveCanvasContent;
  }
  set saveCanvasContent(value: boolean) {
    const oldValue = this._saveCanvasContent;
    this._saveCanvasContent = value;
    this._localStorageService.set('saveCanvasContent', this._saveCanvasContent);
    this.settingsChanged.emit(new SettingsEvent<boolean>('saveCanvasContent', oldValue, value));
  }
}

export class SettingsEvent<T> {
  constructor(private _parameter: string, private _oldValue: T, private _newValue: T) {}

  get parameter(): string {
    return this._parameter;
  }

  get oldValue(): T {
    return this._oldValue;
  }

  get newValue(): T {
    return this._newValue;
  }
}
