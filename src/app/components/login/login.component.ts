///<reference types="chrome"/>
import { Component } from '@angular/core';
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
  }
}
