///<reference types="chrome"/>
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-action',
  template: `
        <div class="actionWrapper">
          <span><i class="material-icons purple md-36">{{ icon }}</i></span>
          <p class="actionText" [innerHTML]="text"></p>
        </div>
      `,
  styles: [`
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
  `],
})
export class ActionComponent {
  @Input() text = '';
  @Input() icon = '';

}
