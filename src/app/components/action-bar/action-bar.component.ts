///<reference types="chrome"/>
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
})
export class ActionBarComponent implements OnChanges {
  @Input() friendsCheckins = '';
  @Input() bid: number;
  @Input() ownRating = '';
  @Input() ownCheckins = '';

  public checkinText = '';
  public ratingText = '';
  public friendsCheckinsText = '';

  constructor() {}

  setCheckinText = (value: number) => {
    // this.checkinText = `Incheckad av dig ${value} `;
    // this.checkinText += value > 1 ? 'gånger.' : 'gång.';
    this.checkinText = value?.toString();
  }

  setRatingText = (value: number) => {
    // this.ratingText = `Din rating ${value}.`;
    this.ratingText = value?.toString();
  }

  setFriendsCheckins = (value: number) => {
    // this.ratingText = `Din rating ${value}.`;
    this.friendsCheckinsText = value?.toString();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownCheckins) {
      this.setCheckinText(changes.ownCheckins.currentValue);
    }
    if (changes.ownRating) {
      this.setRatingText(changes.ownRating.currentValue);
    }
    if (changes.friendsCheckins) {
      this.setFriendsCheckins(changes.friendsCheckins.currentValue);
    }
  }
}
