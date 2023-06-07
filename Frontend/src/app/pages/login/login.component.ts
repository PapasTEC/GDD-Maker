import { Component, OnInit, OnDestroy, Query } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";

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
    private cookieService: CookieService,
    private tostr: ToastrService
  ) {}

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
  image: Blob;
  backG: string;

  loadBackground(imageName: string) {
    let path = this.imagePath + imageName;
    this.backG = "url(" + path + ")";
  }

  ngOnInit() {
    this.loadBackground("log.jpg");
  }

  ngOnDestroy() {}

  checkEmail() {
    this.emailSubmitted = true;
    if (this.emailForm.valid) {
      const email = this.emailForm.value.email;
      this.userService.checkUserExists(email).subscribe((response) => {
        if (response) {
          this.provideCode();
          return;
        } else {
          this.tostr.error("This email is not registered");
          return;
        }
      });
    }
  }

  provideCode() {
    this.codeForm.patchValue({
      code: "",
    });
    this.codeSubmitted = false;
    this.codeForm.reset();
    this.isLogin = false;
    const email = this.emailForm.value.email;
    this.userService.provideCodeUser(email).subscribe((response) => {
      if (response) {
        this.tostr.success("Code sent to your email");
        return;
      } else {
        this.tostr.error("Error sending code");
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
      this.userService.login(email, code).subscribe(
        (response) => {
          if (response.token) {
            localStorage.setItem("ImageUser", response.image);

            localStorage.setItem("ImageUser", response.image);

            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);
            this.cookieService.set("Token", response.token, expirationDate);

            this.tostr.success("You are logged in", "", {
              timeOut: 750,
            });

            setTimeout(() => {
              this.router.navigate(["/dashboard"]);
            }, 900);
            return;
          } else {
            this.tostr.error("Wrong code");
            return;
          }
        },

        (error) => {
          if (error.status == 500) {
            this.tostr.error("Wrong code");
          }
        }
      );
    }
  }
}
