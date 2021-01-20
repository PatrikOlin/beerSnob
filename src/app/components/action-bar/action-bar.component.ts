///<reference types="chrome"/>
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import ActionBarItem from 'src/app/interfaces/actionBarItem';
import Beer from 'src/app/interfaces/beer';
import { BeerService } from 'src/app/services/beer.service';

@Component({
  selector: 'app-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
})
export class ActionBarComponent implements OnInit, OnDestroy {
  beer: Beer;
  actions: ActionBarItem[] = [];

  private _unsub$ = new Subject<boolean>();

  constructor(private beerService: BeerService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.beerService.beer
      .pipe(
        takeUntil(this._unsub$),
        filter((x) => !!x)
      )
      .subscribe(
        (beer: Beer) => {
          if (beer) {
            this.beer = beer;
            const checkins: ActionBarItem = {
              value: beer.ownCheckins.toString(),
              icon: 'beenhere',
              tooltipText: 'Dina incheckningar',
              beer: beer,
              link: null,
            };
            const ownRating: ActionBarItem = {
              value: beer.ownRating.toString(),
              icon: 'grade',
              tooltipText: 'Ditt betyg',
              beer: beer,
              link: null,
            };
            const similar: ActionBarItem = {
              value: beer.similar.length.toString(),
              icon: 'more_horiz',
              tooltipText: `Liknande öl`,
              beer: beer,
              link: 'similarBeers',
            };
            this.ngZone.run(() => {
              this.actions = [];
              this.actions.push(checkins);
              this.actions.push(ownRating);
              this.actions.push(similar);
            });
          }
        },
        (err) => {
          console.log('error i action bar', err);
        }
      );
  }

  ngOnDestroy(): void {
    this._unsub$.next();
    this._unsub$.complete();
  }
}
