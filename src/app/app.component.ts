///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { UntappdCallerService } from './services/untappd-caller.service';
import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import Beer from './interfaces/beer';
const oneHour = 3600000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  public beer: Beer;
  public authHTML = '';
  public errorMsg = '';
  public hasError = false;
  public accessToken = null;
  public isSignedIn = false;
  public user: any;
  public lastQuery: string;
  private _accessToken = new Subject<string>();
  private _isSignedIn = new BehaviorSubject<boolean>(false);

  constructor(private ngZone: NgZone, private untappd: UntappdCallerService) {
  }

  ngOnInit(): void {
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
    chrome.storage.onChanged.addListener( (changes, namespace) => {
      for (const key in changes) {
        if (key === 'signedIn') {
          this._isSignedIn.next(changes[key].newValue);
        }
      }
    });
    return this._isSignedIn.asObservable();
  }

  getAccessTokenFromStorage(): Observable<string> {
    chrome.storage.sync.get(['accessToken'], (res) => {
      this._accessToken.next(res.accessToken);
    });
    return this._accessToken.asObservable();
  }

  getUserInfo(): void {
    chrome.storage.sync.get(['user'], (res) => {
      if (!res.user || Date.now() - res.user.cachedAt > oneHour) {
        this.getUserFromUntappd();
      } else {
        this.user = res.user;
      }
    });
  }

  getUserFromUntappd(): void {
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
              chrome.storage.sync.set({ user: { ...this.user, cachedAt: Date.now() } });
            });
          }
        });
  }

  getBeerFromPage(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const query = tabs[0].title.split('|')[0];
        chrome.storage.sync.get(['lastQuery'], (res: any) => {
          this.lastQuery = res.lastQuery;
          if (query === this.lastQuery) {
            this.getBeerFromStorage();
          } else {
            this.getBeerRating(query);
            chrome.storage.sync.set({ lastQuery: query });
          }
        });
      }
    });
  }

  getBeerRating(query: string): void {
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
        console.log('got beer from untappd', res);
        this.hasError = false;
        this.errorMsg = '';
        const resp = res.response.beer;
        const name = resp.beer_name;
        const brewery = resp.brewery.brewery_name;
        const rating = resp.rating_score;
        const ratingCount = resp.rating_count;
        const style = resp.beer_style;
        const ownCheckins = resp.stats.user_count;
        const ownRating = resp.auth_rating;
        const onWishlist = resp.wish_list;
        const bid = resp.bid;
        const friendsCheckins = resp.friends.count;

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
            style,
            ownRating,
            ownCheckins,
            friendsCheckins,
            onWishlist,
          };
        });
      },
      (err) => console.log(err),
      () => {
        chrome.storage.sync.set({ lastBeer: { ...this.beer }});
      });
  }

  getBeerFromStorage(): void {
    chrome.storage.sync.get(['lastBeer'], (res: any) => {
      console.log('got beer from storage', res);
      this.ngZone.run(() => {
        chrome.browserAction.setBadgeText({
          text: res?.lastBeer?.rating.toFixed(1),
        });
        this.beer = res?.lastBeer;
      });
    });
  }

  authUser(): void {
    chrome.runtime.sendMessage({ message: 'login' }, (response) => {
      if (response === 'auth success') {
        chrome.storage.local.get(['accessToken'], () => {
        });
      }
    });
  }
}
