///<reference types="chrome"/>
import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';

@Component({
  selector: 'app-wishlist-icon',
  template: `<span (click)="onClick()">
        <ng-template [ngIf]="onWishlist" [ngIfElse]="unlisted">
          <span><i class="fa fa-heart"></i></span>
        </ng-template>
        <ng-template #unlisted>
          <span><i class="fa fa-heart-o"></i></span>
        </ng-template>
      </span>`,
  styles: [''],
})
export class WishlistIconComponent {
  @Input() onWishlist = false;
  @Output() wishlistIconClick = new EventEmitter();

  onClick(): void {
    this.onWishlist = !this.onWishlist;
    this.wishlistIconClick.emit(this.onWishlist);
  }

}
