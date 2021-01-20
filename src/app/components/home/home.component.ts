///<reference types="chrome"/>
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { UntappdCallerService } from '../../services/untappd-caller.service';
import { catchError, filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { of, Subject, throwError } from 'rxjs';
import Beer from '../../interfaces/beer';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  public beer: Beer;
  public authHTML = '';
  public errorMsg = '';
  public hasError = false;
  public isSignedIn = false;
  public lastQuery: any;
  private _retried = false;
  private _hoptUrl = 'hopt.se';
  private _glasbUrl = 'glasbanken.se';
  private _bolagetUrl = 'systembolaget.se';
  private _unsub$ = new Subject<boolean>();

  constructor(
    private ngZone: NgZone,
    private untappd: UntappdCallerService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.isSignedIn
      .pipe(
        takeUntil(this._unsub$),
        filter((res) => res),
        switchMap((res) => {
          this.ngZone.run(() => {
            this.isSignedIn = res;
          });
          return this.userService.accessToken.pipe(
            filter((x) => !!x),
            take(1)
          );
        }),
        switchMap((token) => {
          this.untappd.token = token;
          return of(null);
        }),
        switchMap(() => {
          return this.untappd.getUser();
        })
      )
      .subscribe((res) => {
        if (res?.meta?.code === 200) {
          this.ngZone.run(() => {
            const usr = res.response.user;
            const recent = usr.recent_brews.items.map((x: any) => {
              return { bid: x.beer.bid, name: x.beer.beer_name };
            });
            const user = {
              userName: usr.user_name,
              firstName: usr.first_name,
              lastName: usr.last_name,
              stats: {
                totalBeers: usr.stats.total_beers,
              },
              recent_brews: [...recent],
            };
            chrome.storage.sync.set({
              user: { ...user, cachedAt: Date.now() },
            });
          });
        }
      });
  }

  // buildQuery(): void {
  //   chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //     if (tabs[0]) {
  //       let query = {
  //         brewery: '',
  //         name: '',
  //       };
  //       let name: string;
  //       if (tabs[0].url.includes(this._bolagetUrl)) {
  //         const pos = tabs[0].url.split('/').length - 2;
  //         query.name = tabs[0].url.split('/')[pos].replace(/(-)|\d\w+/g, ' ');
  //         chrome.tabs.sendMessage(
  //           tabs[0].id,
  //           { extractFromPage: 'systembolaget' },
  //           (res) => {
  //             query.brewery = res?.brewery ? res.brewery : '';
  //             query.name = res?.name ? res.name : '';
  //             this.getBeerFromPage(query);
  //           }
  //         );
  //       }
  //       if (tabs[0].url.includes(this._hoptUrl)) {
  //         chrome.tabs.sendMessage(
  //           tabs[0].id,
  //           { extractFromPage: 'hopt' },
  //           (res) => {
  //             query.brewery = res?.brewery ? res.brewery : '';
  //             query.name = res?.name ? res.name : '';
  //             this.getBeerFromPage(query);
  //           }
  //         );
  //       }
  //       if (tabs[0].url.includes(this._glasbUrl)) {
  //         chrome.tabs.sendMessage(
  //           tabs[0].id,
  //           { extractFromPage: 'glasbanken' },
  //           (res) => {
  //             query.brewery = res?.brewery ? res.brewery : '';
  //             query.name = res?.name ? res.name : '';
  //             this.getBeerFromPage(query);
  //           }
  //         );
  //       }
  //     }
  //   });
  // }

  // getBeerFromPage(query: any): void {
  //   chrome.storage.sync.get(['lastQuery'], (res: any) => {
  //     this.lastQuery = res.lastQuery;
  //     if (query && query.name === this.lastQuery?.name) {
  //       this.getBeerFromStorage();
  //     } else {
  //       this._retried = false;
  //       this.getBeerRating(query.name, query.brewery);
  //       chrome.storage.sync.set({ lastQuery: query });
  //     }
  //   });
  // }

  // getBeerRating(name: string, brewery = ''): void {
  //   this.untappd
  //     .searchBeer(`${brewery} ${name}`)
  //     .pipe(
  //       switchMap((res) => {
  //         if (res.meta.code === 200 && res.response.beers.count > 0) {
  //           return of(res);
  //         } else if (res.meta.code === 200) {
  //           return throwError({
  //             status: res.meta.code,
  //             error: 'Search returned 0 items',
  //           });
  //         } else {
  //           return throwError({ status: res.status, error: res.error });
  //         }
  //       }),
  //       switchMap((res) =>
  //         this.untappd
  //           .getBeerRating(res?.response?.beers?.items[0]?.beer?.bid)
  //           .pipe(
  //             catchError((e) => {
  //               return throwError(e);
  //             })
  //           )
  //       )
  //     )
  //     .subscribe(
  //       (res) => {
  //         console.log('got beer from untappd', res);
  //         this.hasError = false;
  //         this.errorMsg = '';
  //         const resp = res.response.beer;
  //         const name = resp.beer_name;
  //         const brewery = resp.brewery.brewery_name;
  //         const rating = resp.rating_score;
  //         const ratingCount = resp.rating_count;
  //         const style = resp.beer_style;
  //         const ownCheckins = resp.stats.user_count;
  //         const ownRating = resp.auth_rating;
  //         const onWishlist = resp.wish_list;
  //         const bid = resp.bid;
  //         const friendsCheckins = resp.friends.count;

  //         chrome.browserAction.setBadgeText({
  //           text: rating.toFixed(1),
  //         });
  //         this.ngZone.run(() => {
  //           this.beer = {
  //             bid,
  //             name,
  //             brewery,
  //             rating,
  //             ratingCount,
  //             style,
  //             ownRating,
  //             ownCheckins,
  //             friendsCheckins,
  //             onWishlist,
  //           };
  //         });
  //       },
  //       (err) => {
  //         if (
  //           err.status === 200 &&
  //           err.error === 'Search returned 0 items' &&
  //           !this._retried
  //         ) {
  //           console.log('retrying search with only name');
  //           this.getBeerRating(name);
  //           this._retried = true;
  //         } else {
  //           this.ngZone.run(() => {
  //             this.hasError = true;
  //             console.log('error', err);
  //             this.errorMsg = `Kunde inte hitta ${name}`;
  //           });
  //         }
  //       },
  //       () => {
  //         chrome.storage.sync.set({ lastBeer: { ...this.beer } });
  //       }
  //     );
  // }

  // getBeerFromStorage(): void {
  //   chrome.storage.sync.get(['lastBeer'], (res: any) => {
  //     console.log('got beer from storage', res);
  //     this.ngZone.run(() => {
  //       chrome.browserAction.setBadgeBackgroundColor({ color: '#3C1874' });
  //       chrome.browserAction.setBadgeText({
  //         text: res?.lastBeer?.rating.toFixed(1),
  //       });
  //       this.beer = res?.lastBeer;
  //     });
  //   });
  // }

  // authUser(): void {
  //   chrome.runtime.sendMessage({ message: 'login' }, (response) => {
  //     if (response === 'auth success') {
  //       chrome.storage.local.get(['accessToken'], () => {});
  //     }
  //   });
  // }

  getQuery(site: string): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      var port = chrome.tabs.connect(tabs[0].id, { name: 'knocknock' });
      port.postMessage({ joke: 'knock knock' });
      port.onMessage.addListener((msg) => {
        console.log('svar via port', msg);
      });
    });
  }

  ngOnDestroy() {
    this._unsub$.next();
    this._unsub$.complete();
  }
}
