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
import { TooltipModule } from 'ng2-tooltip-directive';
import { AppRoutingModule } from 'src/app-routing.module';
import { FriendsCheckinsComponent } from './components/friend-checkins/friends-checkins.component';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { SimilarBeersListComponent } from './components/similar-beers-list/similar-beers-list.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SimilarBeerComponent } from './components/similar-beers-list/components/similar-beer/similar-beer.component';

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
    FriendsCheckinsComponent,
    LoaderComponent,
    HomeComponent,
    SimilarBeersListComponent,
    SimilarBeerComponent,
    ToolbarComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    TooltipModule,
    AppRoutingModule,
    NgxSkeletonLoaderModule.forRoot(),
  ],

  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
