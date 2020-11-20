import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { WishlistIconComponent } from './components/wishlist/components/wishlist-icon/wishlist-icon.component';
import { RatingComponent } from './components/rating/rating.component';
import { ActionBarComponent } from './components/action-bar/action-bar.component';
import { ActionComponent } from './components/action-bar/components/action.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WishlistComponent,
    WishlistIconComponent,
    TopBarComponent,
    RatingComponent,
    ActionBarComponent,
    ActionComponent,
  ],
  imports: [BrowserModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
