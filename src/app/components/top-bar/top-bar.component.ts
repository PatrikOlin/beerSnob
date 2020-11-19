///<reference types="chrome"/>
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  title = 'Brygd';
  @Input() username = '';

  constructor() {}
}
