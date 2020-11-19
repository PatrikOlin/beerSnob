///<reference types="chrome"/>
import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';

@Component({
  selector: 'app-action',
  template: `
        <div>
          <span><i class="material-icons purple md-36">{{ icon }}</i></span>
          <p class="actionText">{{ text }}</p>
        </div>
      `,
  styles: [`
    .actionText {
      font-weight: 700;
      font-size: 12px;
    }
  `],
})
export class ActionComponent {
  @Input() text = '';
  @Input() icon = '';

}
