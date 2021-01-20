import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import Beer from 'src/app/interfaces/beer';
import { BeerService } from 'src/app/services/beer.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styles: [
    `
      .toolbarContainer {
        display: flex;
        height: 30px;
        margin-top: 5px;
        background-color: unset;
        z-index: 2;
      }

      .wishlistContainer {
        display: flex;
        width: 100%;
        justify-content: flex-end;
        background: none;
        margin: 5px 10px;
      }

      .backContainer {
        display: flex;
        width: 100;
        justify-content: flex-start;
        margin: 5px 10px;
      }
    `,
  ],
})
export class ToolbarComponent implements OnInit {
  showWishlist = false;
  showBack = false;
  currentUrl = '';
  beer: Beer;

  constructor(
    private location: Location,
    private router: Router,
    private beerService: BeerService
  ) {}

  ngOnInit(): void {
    this.beerService.beer.subscribe((b) => (this.beer = b));
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.urlAfterRedirects.replace('/', '');
        this.setFlags(this.currentUrl);
      });
  }

  setFlags(url: string): void {
    if (url === 'home') {
      this.showWishlist = true;
      this.showBack = false;
    } else {
      this.showWishlist = false;
      this.showBack = true;
    }
  }

  onBackClick(): void {
    this.location.back();
  }
}
