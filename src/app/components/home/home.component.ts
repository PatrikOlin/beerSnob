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

  ngOnDestroy() {
    this._unsub$.next();
    this._unsub$.complete();
  }
}
