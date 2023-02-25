import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor() {
    this.currentUser = null;
    this.errorMsg = null;
  }
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  currentUser: null;

  errorMsg: string | null;

  loginUser = () => {
    // let newErrorMsg: string | null = null;
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;
    if (!username || username.length === 0) {
      this.errorMsg = 'Username is required';
      return;
    }
    if (!password || password.length === 0) {
      this.errorMsg = 'Password is required';
      return;
    }

  };
}
