///<reference types="chrome"/>
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Beer from 'src/app/interfaces/beer';
import { Loc } from 'src/app/interfaces/location.enum';
import SearchQuery from 'src/app/interfaces/searchQuery';
import { BeerService } from 'src/app/services/beer.service';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css'],
})
export class RatingComponent implements OnInit, OnDestroy {
  public beer: Beer;
  public authHTML = '';
  public errorMsg = '';
  public hasError = false;
  public isSignedIn = false;
  public lastQuery: any;
  public isLoading = false;
  private _hoptUrl = 'hopt.se';
  private _glasbUrl = 'glasbanken.se';
  private _bolagetUrl = 'systembolaget.se';
  private _hoptimaalUrl = 'hoptimaal.nl';
  private _unsub$ = new Subject<boolean>();

  constructor(
    private ngZone: NgZone,
    private beerService: BeerService,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.buildQuery();
  }

  buildQuery(): void {
    this.ngZone.run(() => {
      this.isLoading = true;
    });
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        let query = {
          brewery: '',
          name: '',
        };
        if (tabs[0].url.includes(this._bolagetUrl)) {
          this.locationService.location = Loc.BOLAGET;
          const pos = tabs[0].url.split('/').length - 2;
          query.name = tabs[0].url.split('/')[pos].replace(/(-)|\d\w+/g, ' ');
          chrome.tabs.sendMessage(
            tabs[0].id,
            { extractFromPage: 'systembolaget' },
            (res) => {
              query.brewery = res?.brewery ? res.brewery : '';
              query.name = res?.name ? res.name : '';
              this.searchForBeer(query);
            }
          );
        }
        if (tabs[0].url.includes(this._hoptUrl)) {
          this.locationService.location = Loc.HOPT;
          chrome.tabs.sendMessage(
            tabs[0].id,
            { extractFromPage: 'hopt' },
            (res) => {
              query.brewery = res?.brewery ? res.brewery : '';
              query.name = res?.name ? res.name : '';
              this.searchForBeer(query);
            }
          );
        }
        if (tabs[0].url.includes(this._glasbUrl)) {
          this.locationService.location = Loc.GLASBANKEN;
          chrome.tabs.sendMessage(
            tabs[0].id,
            { extractFromPage: 'glasbanken' },
            (res) => {
              query.brewery = res?.brewery ? res.brewery : '';
              query.name = res?.name ? res.name : '';
              this.searchForBeer(query);
            }
          );
        }
        if (tabs[0].url.includes(this._hoptimaalUrl)) {
          this.locationService.location = Loc.HOPTIMAAL;
          chrome.tabs.sendMessage(
            tabs[0].id,
            { extractFromPage: 'hoptimaal' },
            (res) => {
              query.brewery = res?.brewery ? res.brewery : '';
              query.name = res?.name ? res.name : '';
              this.searchForBeer(query);
            }
          );
        }
      }
    });
  }

  searchForBeer(query: SearchQuery) {
    this.beerService
      .getBeerByQuery(query)
      .pipe(takeUntil(this._unsub$))
      .subscribe(
        (beer: Beer) => {
          this.ngZone.run(() => {
            this.isLoading = false;
            this.hasError = false;
            this.beer = beer;
          });
        },
        (err) => {
          this.ngZone.run(() => {
            this.isLoading = false;
            this.hasError = true;
            this.errorMsg = err.message;
          });
        },
        () => {
          this.ngZone.run(() => {
            this.isLoading = false;
          });
        }
      );
  }

  ngOnDestroy(): void {
    this._unsub$.next(true);
    this._unsub$.complete();
  }
}
