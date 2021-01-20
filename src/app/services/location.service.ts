///<reference types="chrome"/>
import { Injectable } from '@angular/core';
import { Loc } from '../interfaces/location.enum';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private _location: Loc;

  constructor() {}

  get location(): Loc {
    return this._location;
  }

  set location(loc: Loc) {
    this._location = loc;
  }
}
