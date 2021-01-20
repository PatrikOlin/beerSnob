import { Component, OnInit, Input } from '@angular/core';
import Beer from 'src/app/interfaces/beer';
import { Loc } from 'src/app/interfaces/location.enum';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-similar-beer',
  template: `
    <main class="similarBeerWrapper" (click)="onClick()">
      <div class="namesWrapper">
        <p class="name">{{ beer.name }}</p>
        <p class="brewery">{{ beer.brewery }}</p>
      </div>
      <p class="rating">{{ beer.rating | number: '1.0-1' }}</p>
    </main>
  `,
  styles: [
    `
      .similarBeerWrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: auto;
        padding: 0px 15px;
        line-height: 1.2;
        padding-bottom: 6px;
        cursor: pointer;
      }

      .similarBeerWrapper p {
        margin-bottom: 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
      }

      .similarBeerWrapper p.name {
        color: var(--darkNavy);
        margin-bottom: 0px;
      }

      .similarBeerWrapper p.brewery {
        font-size: 12px;
        color: var(--darkNavy);
        font-style: italic;
        margin-bottom: 0px;
      }

      p.rating {
        width: 10%;
        color: var(--pink);
        font-weight: 700;
      }

      div.namesWrapper {
        width: 80%;
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class SimilarBeerComponent implements OnInit {
  @Input()
  beer: Beer;
  private _loc: Loc;

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this._loc = this.locationService.location;
  }

  onClick() {
    chrome.tabs.create({ url: this.getURL(this.beer.name) });
  }

  getURL(query: string): string {
    switch (this._loc) {
      case Loc.BOLAGET:
        return `https://www.systembolaget.se/sok/?textQuery=${query}`;
      case Loc.GLASBANKEN:
        return `https://glasbanken.se/?s=${query}&post_type=product`;
      case Loc.HOPT:
        return `https://www.hopt.se/search-result/${query}`;
    }
  }
}
