import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  constructor() { }

  formSubmitted: boolean = false;

  editUserForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  ngOnInit() {
  }

  confirmUpdate() {
    this.formSubmitted = true;
    if (this.editUserForm.valid) {
      alert("Your account has been updated successfully")
      this.submit();
    }
  }

  submit() {
    // const newUser = this.editUserForm.value;
    // this.http.post("/api/users/add/", newUser).subscribe((response) => {
    //   console.log("Usuario creado:", response);
    // });
    // this.router.navigate(['/login']);
  }

}
