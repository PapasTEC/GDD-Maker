import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router, private userService: UserService) { }

  currentUser: null;
  formSubmitted: boolean = false;

  ngOnInit() { }

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
          alert("This email is already registered");
          return;
        } else {
          alert("Your account has been created successfully")
          this.submit();
        }
      });
    }
  }

  submit() {
    const newUser = this.registerForm.value;
    this.http.post("/api/users/add/", newUser).subscribe((response) => {
      console.log("Usuario creado:", response);
    });
    this.router.navigate(['/login']);
  }
}
