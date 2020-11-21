///<reference types="chrome"/>
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Beer from 'src/app/interfaces/beer';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
})
export class ActionBarComponent implements OnChanges {
  @Input() friendsCheckins = '';
  @Input() beer: Beer;
  @Input() ownRating = '';
  @Input() ownCheckins = '';

  public checkinText = '';
  public cTooltip = '';
  public ratingText = '';
  public rTooltip = '';
  public friendsCheckinsText = '';
  public fcTooltip = '';

  constructor() {}

  setCheckinText = (value: number) => {
    // this.checkinText = `Incheckad av dig ${value} `;
    // this.checkinText += value > 1 ? 'gånger.' : 'gång.';
    this.checkinText = value?.toString();
    this.cTooltip = `Dina incheckningar.`;
  }

  setRatingText = (value: number) => {
    // this.ratingText = `Din rating ${value}.`;
    this.ratingText = value?.toString();
    this.rTooltip = `Ditt betyg`;
  }

  setFriendsCheckins = (value: number) => {
    // this.ratingText = `Din rating ${value}.`;
    this.friendsCheckinsText = value?.toString();
    this.fcTooltip = `Hur många vänner som har checkat in.`;
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
