///<reference types="chrome"/>
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
})
export class ActionBarComponent implements OnChanges {
  @Input() onWishlist = false;
  @Input() bid: number;
  @Input() ownRating = '';
  @Input() ownCheckins = '';

  public checkinText = '';
  public ratingText = '';

  constructor() {}

  setCheckinText = (value: number) => {
    this.checkinText = `Incheckad av dig ${value} `;
    this.checkinText += value > 1 ? 'gånger.' : 'gång.';
  }

  setRatingText = (value: number) => {
    this.ratingText = `Din rating ${value}.`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes.ownCheckins) {
      this.setCheckinText(changes.ownCheckins.currentValue);
    }
    if (changes.ownRating) {
      this.setRatingText(changes.ownRating.currentValue);
    }
  }
}
