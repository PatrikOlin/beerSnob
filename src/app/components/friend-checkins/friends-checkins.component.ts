///<reference types="chrome"/>
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import Beer from 'src/app/interfaces/beer';
import { BeerService } from 'src/app/services/beer.service';

@Component({
  selector: 'app-friends-checkins',
  template: `
    <main>
      Här äre friends
      {{ this.beer | json }}
    </main>
  `,
  styles: [``],
})
export class FriendsCheckinsComponent implements OnInit, OnDestroy {
  private _unsub$ = new Subject<boolean>();
  beer: Beer = null;

  constructor(private beerService: BeerService, private ngZone: NgZone) {}

  ngOnInit(): void {
    console.log('HEJJE?');
    this.beerService.beer
      .pipe(
        takeUntil(this._unsub$),
        filter((x) => !!x)
      )
      .subscribe((beer: Beer) => {
        console.log('beeeer i freindscheckingscomp', beer);
        this.ngZone.run(() => {
          this.beer = beer;
        });
      });
  }

  ngOnDestroy(): void {
    this._unsub$.next();
    this._unsub$.complete();
  }
}
