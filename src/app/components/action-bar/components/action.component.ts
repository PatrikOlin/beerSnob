///<reference types="chrome"/>
import {
  Component,
  Input,
  NgZone,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import Beer from 'src/app/interfaces/beer';

@Component({
  selector: 'app-action',
  template: `
    <div
      class="actionWrapper"
      [tooltip]="tooltipText"
      [options]="tooltipOpts"
      (click)="navigateTo()"
    >
      <span
        ><i class="material-icons purple md-36">{{ icon }}</i></span
      >
      <p class="actionText">{{ value }}</p>
    </div>
  `,
  styles: [
    `
      .actionWrapper {
        width: 80px;
        margin: auto;
      }

      .actionText {
        font-weight: 700;
        font-size: 16px;
      }

      .md-36 {
        width: 36px;
      }
    `,
  ],
})
export class ActionComponent implements OnChanges {
  @Input() value = '';
  @Input() icon = '';
  @Input() tooltipText = '';
  @Input() link = '';
  @Input() beer: Beer;

  tooltipOpts = {
    autoPlacement: 'true',
    'tooltip-class': 'tooltipStyle',
    theme: 'light',
  };

  constructor(private router: Router, private ngZone: NgZone) {
    console.log('öl i action', this.beer);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes', changes, changes.beer.currentValue);
    this.ngZone.run(() => {
      this.value = changes.value.currentValue;
      this.icon = changes.icon.currentValue;
      this.tooltipText = changes.tooltipText.currentValue;
      this.link = changes.link.currentValue;
      this.beer = changes.beer.currentValue;
    });
  }

  navigateTo(): void {
    if (!this.link) {
      return;
    }

    this.router.navigate([this.link], { state: { beer: this.beer } });
  }
}
