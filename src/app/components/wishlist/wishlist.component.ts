///<reference types="chrome"/>
import { Component, Input } from '@angular/core';
import { UntappdCallerService } from 'src/app/services/untappd-caller.service';

@Component({
  selector: 'app-wishlist',
  template: `
    <app-wishlist-icon
      class="wishlistIconWrapper"
      [onWishlist]="onWishlist"
      (wishlistIconClick)="onClick($event)"
      [tooltip]="
        onWishlist ? 'Ta bort från önskelistan' : 'Lägg till på önskelistan'
      "
      [options]="tooltipOpts"
    >
    </app-wishlist-icon>
  `,
  styles: [
    `
      .wishlistIconWrapper {
        width: 100px;
        margin: 5px;
      }
    `,
  ],
})
export class WishlistComponent {
  @Input() onWishlist = false;
  @Input() bid: number;
  tooltipOpts = {
    autoPlacement: 'true',
    'tooltip-class': 'tooltipStyle',
    theme: 'light',
  };

  constructor(private untappd: UntappdCallerService) {}

  onClick(onWishlist: boolean): void {
    if (!onWishlist) {
      this.untappd
        .removeFromWishlist(this.bid)
        .subscribe(() => console.log(`${this.bid} removed from wishlist`));
    } else {
      this.untappd
        .addToWishlist(this.bid)
        .subscribe(() => console.log(`${this.bid} added to wishlist`));
    }
    this.onWishlist = onWishlist;
  }
}
