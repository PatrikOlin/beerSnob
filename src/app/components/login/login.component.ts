///<reference types="chrome"/>
import { Component, NgZone, OnInit } from '@angular/core';
import { UntappdCallerService } from 'src/app/services/untappd-caller.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  title = 'Ölbolaget';
  public hasError = false;

  constructor(private untappd: UntappdCallerService) {}

  authUser(): void {
    chrome.runtime.sendMessage({ message: 'login' }, (response) => {
      console.log('resp', response);
      if (response.success) {
        console.log('success in app comp');
        this.untappd.authorizeUser(response.code).subscribe((res: any) => {
          console.log(res)
          const token = res?.response?.access_token;
          chrome.storage.sync.set({accessToken: token});
        });
      } else {
        this.hasError = true;
      }
    });
  }
}
