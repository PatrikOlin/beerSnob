///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { UntappdCallerService } from './services/untappd-caller.service';
import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Ölbolaget';
  public beerName: string;
  public beerRating: number;
  public beerRatingCount: number;
  public beerStyle: string;
  public ownCheckins: number;
  public ownRating: number;
  public isOnWishlist: boolean;
  public authHTML = '';
  public errorMsg = '';
  public hasError = false;
  private _accessToken = new Subject<string>();
  public accessToken = null;
  private _isSignedIn = new BehaviorSubject<boolean>(false);
  public isSignedIn = false;
  private _bkg;
  public user: any;

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
        });
      }
    });
  }

  getBeerFromPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const name = tabs[0].title.split('|')[0];
        this.getBeerRating(name);
      }
    });
  }

  getBeerRating(name: string) {
    this.untappd
      .searchBeer(name)
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
        const rating = res.response.beer.rating_score;
        const ratingCount = res.response.beer.rating_count;
        const style = res.response.beer.beer_style;
        const checkins = res.response.beer.stats.user_count;
        const authRating = res.response.beer.auth_rating;
        const onWishList = res.response.beer.wish_list;

        chrome.browserAction.setBadgeText({
          text: rating.toFixed(1),
        });
        this.ngZone.run(() => {
          this.beerName = name;
          this.beerRating = rating;
          this.beerRatingCount = ratingCount;
          this.beerStyle = style;
          this.ownCheckins = checkins;
          this.ownRating = authRating;
          this.isOnWishlist = onWishList;
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
