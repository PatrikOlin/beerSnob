///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { UntappdCallerService } from './services/untappd-caller.service';
import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import Beer from './interfaces/beer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public beer: Beer;
  public ownCheckins: number;
  public ownRating: number;
  public friendsCheckins: number;
  public isOnWishlist: boolean;
  public authHTML = '';
  public errorMsg = '';
  public hasError = false;
  public accessToken = null;
  public isSignedIn = false;
  public user: any;
  private _accessToken = new Subject<string>();
  private _isSignedIn = new BehaviorSubject<boolean>(false);
  private _bkg;

  constructor(private ngZone: NgZone, private untappd: UntappdCallerService) {
    this._bkg = chrome.extension.getBackgroundPage();
  }

  ngOnInit() {
    this.getSignedInStatus().subscribe((res) => {
      this.ngZone.run(() => {
        this.isSignedIn = res;

        if (this.isSignedIn) {
          this.getAccessTokenFromStorage().subscribe((res) => {
            this.untappd.token = res;
            this.getUserInfo();
            this.getBeerFromPage();
          });
        }
      });
    });
  }

  getSignedInStatus(): Observable<boolean> {
    chrome.storage.sync.get(['signedIn'], (res) => {
      this._isSignedIn.next(res.signedIn);
    });
    return this._isSignedIn.asObservable();
  }

  getAccessTokenFromStorage(): Observable<string> {
    chrome.storage.sync.get(['accessToken'], (res) => {
      this._accessToken.next(res.accessToken);
    });
    return this._accessToken.asObservable();
  }

  forceLoginRefresh() {
    this.ngZone.run(() => {
      this.isSignedIn = false;
      this.hasError = false;
    });
  }

  getUserInfo() {
    this.untappd.getUser().subscribe((res: any) => {
      if (res?.meta?.code === 200) {
        this.ngZone.run(() => {
          const usr = res.response.user;
          const recent = usr.recent_brews.items.map((x: any) => {
            return { bid: x.beer.bid, name: x.beer.beer_name };
          });
          this.user = {
            userName: usr.user_name,
            firstName: usr.first_name,
            lastName: usr.last_name,
            stats: {
              totalBeers: usr.stats.total_beers,
            },
            recent_brews: [...recent],
          };
          console.log('user', this.user)
        });
      }
    });
  }

  getBeerFromPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const query = tabs[0].title.split('|')[0];
        this.getBeerRating(query);
      }
    });
  }

  getBeerRating(query: string) {
    this.untappd
      .searchBeer(query)
      .pipe(
        switchMap((res) =>
          this.untappd.getBeerRating(res.response.beers.items[0].beer.bid)
        ),
        catchError((e) => {
          this.ngZone.run(() => {
            this.hasError = true;
            this.errorMsg = `Kunde inte hitta ${name}`;
          });
          return throwError(e);
        })
      )
      .subscribe((res) => {
        this.hasError = false;
        this.errorMsg = '';
        const resp = res.response.beer;
        const name = resp.beer_name;
        const brewery = resp.brewery.brewery_name;
        const rating = resp.rating_score;
        const ratingCount = resp.rating_count;
        const style = resp.beer_style;
        const checkins = resp.stats.user_count;
        const authRating = resp.auth_rating;
        const onWishlist = resp.wish_list;
        const bid = resp.bid;
        const friendsCheckins = resp.friends.count

        chrome.browserAction.setBadgeText({
          text: rating.toFixed(1),
        });
        this.ngZone.run(() => {
          this.beer = {
            bid,
            name,
            brewery,
            rating,
            ratingCount,
            style
          };
          this.ownCheckins = checkins;
          this.ownRating = authRating;
          this.isOnWishlist = onWishlist;
          this.friendsCheckins = friendsCheckins;
          console.log('ownCheckins', checkins)
          console.log('ownRating', authRating)
          console.log('onwishlist', onWishlist)
        });
      });
  }

  authUser() {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
      if (response === 'auth success') {
        console.log('success in app comp');
        chrome.storage.local.get(['accessToken'], function (result) {
          console.log('accessToken is', result);
        });
      }
    });
    // this.untappd.authUser().subscribe((res) => {
    //   this.ngZone.run(() => {
    //     this.authHTML = res;
    //   });
    // });
  }
}

// if (res?.response?.beers?.items[0]?.beer) {
//   this.noBeerFound = false;
// } else {
//   this.noBeerFound = true;
// }
