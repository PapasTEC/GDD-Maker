import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["../login/login.component.scss", "./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  currentUser: null;
  formSubmitted: boolean = false;

  imagePath: string = "/assets/img/regLog/";
  image: Blob;
  backG: string;

  loadBackground(imageName: string) {
    let path = this.imagePath + imageName;
    this.backG = "url(" + path + ")";
  }

  ngOnInit() {
    this.loadBackground("reg.jpg");
  }

  registerForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  confirmRegister() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      const email = this.registerForm.value.email;
      this.userService.checkUserExists(email).subscribe((response) => {
        if (response) {
          this.toastr.error("This email is already register");
          return;
        } else {
          this.submit();
        }
      });
    }
  }

  submit() {
    try {
      const newUser = this.registerForm.value;
      this.http.post("/api/users/add/", newUser).subscribe((response) => {});
      this.toastr.success("Your account has been created successfully", "", {
        timeOut: 800,
      });
      setTimeout(() => {
        this.router.navigate(["/login"]);
      }, 1000);
    } catch (err) {
      this.toastr.error("Error creating your account");
    }
  }
}
