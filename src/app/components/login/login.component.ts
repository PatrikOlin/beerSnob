///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { UntappdCallerService } from 'src/app/services/untappd-caller.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  public hasError$;

  constructor(private userService: UserService) {}

  authUser(): void {
    this.hasError$ = this.userService.hasError;
    this.userService.authUser();
    //   chrome.runtime.sendMessage({ message: 'login' }, (response) => {
    //     console.log('resp', response);
    //     if (response.success) {
    //       console.log('success in app comp');
    //       this.untappd.authorizeUser(response.code).subscribe((res: any) => {
    //         const userSignedIn = true;
    //         chrome.storage.sync.set({ signedIn: userSignedIn }, () => {
    //           console.log('signedIn set in storage');
    //         });
    //         const token = res?.response?.access_token;
    //         chrome.storage.sync.set({accessToken: token});
    //       });
    //     } else {
    //       this.hasError = true;
    //     }
    //   });
  }
}
