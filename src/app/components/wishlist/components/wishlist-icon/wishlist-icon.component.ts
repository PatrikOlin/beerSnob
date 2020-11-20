///<reference types="chrome"/>
import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';

@Component({
  selector: 'app-wishlist-icon',
  template: `<span (click)="onClick()">
        <ng-template [ngIf]="onWishlist" [ngIfElse]="unlisted">
          <span><i class="material-icons md-36 purple">favorite</i></span>
        </ng-template>
        <ng-template #unlisted>
          <span><i class="material-icons md-36 purple">favorite_border</i></span>
        </ng-template>
      </span>`,
  styles: [`
  .actionText {
  font-weight: 700;
  font-size: 12px;
  }
`],
})
export class WishlistIconComponent {
  @Input() onWishlist = false;
  @Output() wishlistIconClick = new EventEmitter();

  onClick(): void {
    this.onWishlist = !this.onWishlist;
    this.wishlistIconClick.emit(this.onWishlist);
  }

}
