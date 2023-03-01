import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor() { }

  currentUser: null;
  formSubmitted: boolean = false;

  ngOnInit() {
  }

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email])
  });

  confirmRegister() {
    this.formSubmitted = true; 
    if (this.registerForm.valid) {
      return confirm('A code will be sent to your email address which will serve as your password to log in. Do you want to continue?'
      );
    }
  }

  submit() {
    console.log(this.registerForm.value);}

}
