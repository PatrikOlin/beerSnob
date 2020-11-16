///<reference types="chrome"/>
import { Component, Input } from '@angular/core';
import { UntappdCallerService } from 'src/app/services/untappd-caller.service';

@Component({
  selector: 'app-wishlist',
  template: `
      <app-wishlist-icon [onWishlist]="onWishlist" (wishlistIconClick)="onClick($event)">
      </app-wishlist-icon>
      `,
  styles: [''],
})
export class WishlistComponent {
  @Input() onWishlist = false;
  @Input() bid: number;

  constructor(private untappd: UntappdCallerService) {}

  onClick(onWishlist: boolean): void {
    if (!onWishlist) {
      this.untappd.removeFromWishlist(this.bid)
        .subscribe(() => console.log(`${this.bid} removed from wishlist`));
    } else {
      this.untappd.addToWishlist(this.bid)
        .subscribe(() => console.log(`${this.bid} added to wishlist`));
    }
  }

}
