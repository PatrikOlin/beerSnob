///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntappdCallerService } from './services/untappd-caller.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'untappdbolaget';
  public beerName: string;
  public beerRating: number;
  public beerRatingCount: number;
  public authHTML = '';
  public errorMsg = '';
  public hasError = false;
  public accessToken = 'bajs';

  constructor(private ngZone: NgZone, private untappd: UntappdCallerService) {}

  ngOnInit() {
    this.getAccessTokenFromStorage();
      // this.getBeerFromPage();
  }

  getAccessTokenFromStorage() {
    chrome.storage.local.get(['accessToken'], function(result) {
      this.accessToken = result.accessToken;
      alert(this.accessToken)
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

        chrome.browserAction.setBadgeText({
          text: rating.toFixed(1),
        });
        this.ngZone.run(() => {
          this.beerName = name;
          this.beerRating = rating;
          this.beerRatingCount = ratingCount;
        });
      });
  }

  authUser() {
    chrome.runtime.sendMessage({ message: 'login' }, function (response) {
      if (response === 'auth success') {
        console.log('success in app comp');
        chrome.storage.local.get(['accessToken'], function(result) {
          console.log('accessToken is', result);
        });
      }});
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
