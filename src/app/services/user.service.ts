///<reference types="chrome"/>
import { Injectable, NgZone } from '@angular/core';
import { UntappdCallerService } from './untappd-caller.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import User from '../interfaces/user';
const oneHour = 3600000;

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _accessToken = new Subject<string>();
  private _isSignedIn = new BehaviorSubject<boolean>(false);
  private _user = new Subject<User>();
  private _hasError = new Subject<boolean>();

  constructor(private ngZone: NgZone, private untappd: UntappdCallerService) {}

  get user(): Observable<User> {
    return this.getUserInfo();
  }

  get accessToken(): Observable<string> {
    return this.getAccessTokenFromStorage();
  }

  get isSignedIn(): Observable<boolean> {
    return this.getIsSignedInFromStorage();
  }

  get hasError(): Observable<boolean> {
    return this._hasError.asObservable();
  }

  public authUser(): void {
    chrome.runtime.sendMessage({ message: 'login' }, (response) => {
      if (response.success) {
        this.untappd.authorizeUser(response.code).subscribe((res: any) => {
          const userSignedIn = true;
          chrome.storage.sync.set({ signedIn: userSignedIn }, () => {});
          const token = res?.response?.access_token;
          chrome.storage.sync.set({ accessToken: token });
        });
        this._hasError.next(false);
      } else {
        this._hasError.next(true);
      }
    });
  }

  private getIsSignedInFromStorage(): Observable<boolean> {
    chrome.storage.sync.get(['signedIn'], (res) => {
      this._isSignedIn.next(res.signedIn);
    });
    chrome.storage.onChanged.addListener((changes, _) => {
      for (const key in changes) {
        if (key === 'signedIn') {
          this._isSignedIn.next(changes[key].newValue);
        }
      }
    });
    return this._isSignedIn.asObservable();
  }

  private getAccessTokenFromStorage(): Observable<string> {
    chrome.storage.sync.get(['accessToken'], (res) => {
      this._accessToken.next(res.accessToken);
    });
    return this._accessToken.asObservable();
  }

  private getUserInfo(): Observable<User> {
    chrome.storage.sync.get(['user'], (res) => {
      if (!res.user || Date.now() - res.user.cachedAt > oneHour) {
        this.getUserFromUntappd();
      } else {
        this._user.next(res.user);
      }
    });
    return this._user.asObservable();
  }

  private getUserFromUntappd(): Observable<User> {
    this.untappd.getUser().subscribe((res: any) => {
      if (res?.meta?.code === 200) {
        this.ngZone.run(() => {
          const usr = res.response.user;
          const recent = usr.recent_brews.items.map((x: any) => {
            return { bid: x.beer.bid, name: x.beer.beer_name };
          });
          const user = {
            userName: usr.user_name,
            firstName: usr.first_name,
            lastName: usr.last_name,
            stats: {
              totalBeers: usr.stats.total_beers,
            },
            recent_brews: [...recent],
          };
          this._user.next(user);
          chrome.storage.sync.set({
            user: { ...user, cachedAt: Date.now() },
          });
        });
      }
    });
    return this._user.asObservable();
  }
}
