import { Component, OnInit, OnDestroy, Query } from '@angular/core';
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
      if (response) {
        alert("Code sent to your email");
        return;
      } else {
        alert("Error sending code");
        return;
      }
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
          var localUser = JSON.stringify(response);
          var localUserObj = JSON.parse(localUser);
          delete localUserObj.password;
          // delete localUserObj.owned_documents;
          // delete localUserObj.shared_with_me_documents;
          localUserObj.owned_documents = localUserObj.owned_documents.length
          localUserObj.shared_with_me_documents = localUserObj.shared_with_me_documents.length
          delete localUserObj._id;
          delete localUserObj.__v;

          localStorage.setItem('currentUser', JSON.stringify(localUserObj));
          
          this.router.navigate(['/dashboard']);          
          return;
        }else{
          alert("Wrong code");
          return;
        }
      });
    }
  }

}
