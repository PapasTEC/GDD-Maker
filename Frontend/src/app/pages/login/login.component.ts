import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(private http: HttpClient, private router: Router) { }

  isLogin: boolean = true;
  signInText: string = 'Sign in with credentials';
  emailSubmitted: boolean = false;
  codeSubmitted: boolean = false;

  emailForm = new FormGroup({email: new FormControl("", [Validators.required, Validators.email])});
  codeForm = new FormGroup({code: new FormControl("", [Validators.required])});

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  checkEmail() {
    this.emailSubmitted = true;
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.http.get(`/api/users/get/${email}/`).subscribe((response) => {
        if (response) {
          this.provideCode();
          return;
        } else {
          alert("This email is not registered");
          return;
        }
      });
    }
  }

  provideCode(){
    this.isLogin = false;
    const email = this.emailForm.value.email;
    this.http.put(`/api/users/sendCode/${email}/`,{}).subscribe((response) => {
      console.log("Code generated:", response);
    });
  }


  returnToLogin() {
    this.isLogin = true;
  }

  signIn(){
    this.codeSubmitted = true;
    if (this.codeForm.valid) {
      const email = this.emailForm.value.email;
      const code = this.codeForm.value.code;
      this.http.get(`/api/users/login/${email}/${code}`).subscribe((response) => {
        if (response) {
          alert("You are logged in");
          localStorage.setItem('currentUser', JSON.stringify(response));
          this.router.navigate(['/register']);          
          return;
        }else{
          alert("Wrong code");
          return;
        }
      });
    }
  }

}
