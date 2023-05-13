import { Component, OnInit, OnDestroy, Query } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, OnDestroy {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) { }

  isLogin: boolean = true;
  signInText: string = "Sign in with credentials";
  emailSubmitted: boolean = false;
  codeSubmitted: boolean = false;

  emailForm = new FormGroup({
    email: new FormControl("", [Validators.required, Validators.email]),
  });
  codeForm = new FormGroup({
    code: new FormControl("", [Validators.required]),
  });


  imagePath: string = "/assets/img/regLog/";
  image:Blob;
  backG:string;

  loadBackground(imageName: string) {
    let path = this.imagePath + imageName;
    this.backG = "url(" + path + ")";
  }

  ngOnInit() {
    this.loadBackground("log.jpg");
  }

  ngOnDestroy() { }

  checkEmail() {
    this.emailSubmitted = true;
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.userService.checkUserExists(email).subscribe((response) => {
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

  provideCode() {
    this.codeForm.patchValue({
      code: ""
    });
    this.codeSubmitted = false;
    this.codeForm.reset();
    this.isLogin = false;
    const email = this.emailForm.value.email;
    this.userService.provideCodeUser(email).subscribe((response) => {
      if (response) {
        console.log(response)
        alert("Code sent to your email");
        return;
      } else {
        alert("Error sending code");
        return;
      }
    });
  }

  returnToLogin() {
    this.emailSubmitted = false;
    this.emailForm.reset();
    this.isLogin = true;
  }
  showPassword: boolean = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  signIn() {
    this.codeSubmitted = true;
    if (this.codeForm.valid) {
      const email = this.emailForm.value.email;
      const code = this.codeForm.value.code;
      this.userService.login(email, code).subscribe((response) => {
        console.log("response ",response);
        if (response.token) {
          this.codeForm.patchValue({
            code: ""
          });
          alert("You are logged in");
          localStorage.setItem("ImageUser", response.image);

          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);
          this.cookieService.set("Token", response.token, expirationDate);

          this.router.navigate(["/dashboard"]);
          return;
        } else {
          alert("Wrong code");
          return;
        }
      },

        (error) => {
          console.log(error);
          if (error.status == 500) {

            alert("Wrong code");
          }
        });
    }
  }
}
