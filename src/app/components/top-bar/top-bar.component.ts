///<reference types="chrome"/>
import { Component, Input, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import User from 'src/app/interfaces/user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent implements OnInit, OnDestroy {
  public user: User;
  private _unsub$ = new Subject<boolean>();

  constructor(private userService: UserService, private ngZone: NgZone) {}

  ngOnInit(): void {
    chrome.storage.onChanged.addListener((changes, _) => {
      for (const key in changes) {
        if (key === 'user') {
          console.log('user found', changes[key].newValue);
          this.ngZone.run(() => {
            this.user = changes[key].newValue;
          });
        }
      }
    });
  }

  ngOnDestroy(): void {
    this._unsub$.next();
    this._unsub$.complete();
  }
}
