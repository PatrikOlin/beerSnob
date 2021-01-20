///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import Beer from 'src/app/interfaces/beer';
import { BeerService } from 'src/app/services/beer.service';

@Component({
  selector: 'app-similar-beers-list',
  templateUrl: './similar-beers-list.component.html',
  styles: [
    `
      .similarBeersListWrapper {
      }

      h4 {
        font-size: 18px;
        font-weight: 700;
        color: var(--darkNavy);
      }

      .beerName {
        font-size: 22px;
        font-weight: 700;
        color: var(--pink);
      }

      .sep:not(:last-of-type) {
        width: 80%;
        height: 2px;
        background-color: var(--purple);
        margin: auto;
        margin-bottom: 10px;
      }
    `,
  ],
})
export class SimilarBeersListComponent implements OnInit {
  beer: Beer;
  beers: Beer[];

  constructor(private beerService: BeerService, private ngZone: NgZone) {}

  ngOnInit(): void {
    this.beerService.beer.pipe(take(1)).subscribe((beer: Beer) => {
      this.ngZone.run(() => {
        this.beer = beer;
        this.beers = beer?.similar;
      });
    });
  }
}
