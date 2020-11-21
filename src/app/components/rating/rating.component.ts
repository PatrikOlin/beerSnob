///<reference types="chrome"/>
import { Component, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import Beer from 'src/app/interfaces/beer';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnChanges {
  @Input() beer: Beer;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
  }

}







