///<reference types="chrome"/>
import { Injectable } from '@angular/core';
import {
  Subject,
  Observable,
  ReplaySubject,
  throwError,
  of,
  EMPTY,
} from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import Beer from '../interfaces/beer';
import { UntappdCallerService } from 'src/app/services/untappd-caller.service';
import SearchQuery from '../interfaces/searchQuery';

@Injectable({
  providedIn: 'root',
})
export class BeerService {
  private _beer = new ReplaySubject<Beer>(1);
  private _retried = false;
  private _lastQuery: SearchQuery;
  private _cachedName: string;

  constructor(private untappd: UntappdCallerService) {}

  get beer(): Observable<Beer> {
    console.log('här haru beer');
    return this._beer;
  }

  setBeer(beer: Beer): void {
    this._beer.next(beer);
  }

  getBeerByQuery(query: SearchQuery): Observable<Beer> {
    chrome.storage.sync.get(['lastQuery'], (res: any) => {
      this._lastQuery = res.lastQuery;
      if (query && query.name === this._lastQuery?.name) {
        this.getBeerFromStorage();
      } else {
        this._retried = false;
        this.getBeerRating(query.name, query.brewery);
        chrome.storage.sync.set({ lastQuery: query });
      }
    });
    return this._beer;
  }

  private getBeerRating(name: string, brewery = ''): void {
    this._cachedName = name;
    let tempBeer: Beer;
    this.untappd
      .searchBeer(`${brewery} ${name}`)
      .pipe(
        switchMap((res) => {
          if (res.meta.code === 200 && res.response.beers.count > 0) {
            return of(res);
          } else if (res.meta.code === 200) {
            return throwError({
              status: res.meta.code,
              error: 'Search returned 0 items',
            });
          } else {
            return throwError({ status: res.status, error: res.error });
          }
        }),
        switchMap((res) =>
          this.untappd
            .getBeerRating(res?.response?.beers?.items[0]?.beer?.bid)
            .pipe(
              catchError((e) => {
                this.handleError(e);
                return EMPTY;
              })
            )
        )
      )
      .subscribe(
        (res) => {
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
          const similar = [];
          resp?.similar?.items.forEach((i: any) => {
            const sb: Beer = {
              bid: i.beer.bid,
              name: i.beer.beer_name,
              brewery: i.brewery.brewery_name,
              rating: i.rating_score,
              ratingCount: null,
              style: i.beer.beer_style,
              ownCheckins: i.beer.has_had ? 1 : 0,
              ownRating: null,
              onWishlist: null,
              friendsCheckins: null,
            };
            similar.push(sb);
          });

          chrome.browserAction.setBadgeText({
            text: rating.toFixed(1),
          });
          const beer = {
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
            similar,
          };
          this.setBeer(beer);
          tempBeer = beer;
        },
        (err) => {
          this.handleError(err);
          console.log('errorare?', err);
        },
        () => {
          chrome.storage.sync.set({ lastBeer: { ...tempBeer } });
        }
      );
  }

  private handleError(error: any) {
    if (
      error.status === 200 &&
      error.error === 'Search returned 0 items' &&
      !this._retried
    ) {
      console.log('retrying search with only name');
      this.getBeerRating(this._cachedName);
      this._retried = true;
    } else {
      this._beer.error({
        status: error.status,
        untappdError: error.error,
        message: 'Sökningen returnerade ingen träff',
      });
    }
  }

  private getBeerFromStorage(): void {
    chrome.storage.sync.get(['lastBeer'], (res: any) => {
      console.log('got beer from storage', res);
      chrome.browserAction.setBadgeBackgroundColor({ color: '#3C1874' });
      chrome.browserAction.setBadgeText({
        text: res?.lastBeer?.rating?.toFixed(1),
      });
      this.setBeer(res?.lastBeer);
    });
  }
}
