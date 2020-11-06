import { Component, NgZone, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UntappdCallerService } from './services/untappd-caller.service';
import { switchMap } from 'rxjs/operators';

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

  constructor(private ngZone: NgZone, private untappd: UntappdCallerService) {}

  ngOnInit() {
    // this.untappd.authUser().subscribe((res) => console.log(res));
    this.getBeerFromPage();
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
        )
      )
      .subscribe((res) => {
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
    this.untappd.authUser().subscribe((res) => {
      this.ngZone.run(() => {
        this.authHTML = res;
      });
    });
  }
}
