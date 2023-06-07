import { Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import { HttpClient } from "@angular/common/http";

import { DocumentService } from "../../services/document.service";
import { TokenService } from "src/app/services/token.service";
import { UserService } from "src/app/services/user.service";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private documentService: DocumentService,
    private tostr: ToastrService
  ) {}

  @ViewChild("fileInput") fileInput;
  profileImage: string =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  formSubmitted: boolean = false;
  localUser = {
    email: "",
    name: "",
    image: "",
    owned_documents: [],
    shared_with_me_documents: [],
  };
  userID: string = "";

  editUserForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  ngOnInit() {
    this.tokenService.decodeToken().subscribe((data: any) => {
      this.localUser = data.decoded;
      this.localUser.image = localStorage.getItem("ImageUser");

      this.userService
        .getUser(this.localUser.email)
        .subscribe((response: any) => {
          Object.assign(this.localUser, response);
          this.userID = response._id;
        });

      this.editUserForm = this.formBuilder.group({
        name: [this.localUser.name, Validators.required],
        email: [this.localUser.email, [Validators.required, Validators.email]],
      });

      if (!this.localUser.owned_documents) {
        this.localUser.owned_documents = [];
      }
      if (!this.localUser.shared_with_me_documents) {
        this.localUser.shared_with_me_documents = [];
      }
      this.profileImage = this.localUser.image;
    });
  }

  async confirmUpdate() {
    this.formSubmitted = true;
    if (this.editUserForm.valid) {
      let { isConfirmed } = await Swal.fire({
        title: "Do you want to update your profile?",
        icon: "question",
        showDenyButton: true,
        confirmButtonText: `Yes`,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });

      if (isConfirmed) {
        this.http
          .get(`/api/users/get/${this.editUserForm.value.email}/`)
          .subscribe((response: any) => {
            if (response && response._id != this.userID) {
              this.tostr.error(
                "This email is already registered in another account"
              );
              return;
            } else {
              this.submit();
              this.tostr.success("Your account has been updated successfully");
            }
          });
      }
    }
  }

  submit() {
    const userData = this.editUserForm.value;
    const updateUser = {
      name: userData.name,
      email: userData.email,
      image: this.profileImage,
    };

    this.http
      .put(`/api/users/update/${this.localUser.email}`, updateUser)
      .subscribe((response) => {
        this.documentService
          .updateOwnerInDocuments(this.localUser.email, {
            owner: updateUser.email,
          })
          .subscribe((response) => {
            this.cookieService.delete("Token");
            this.tokenService
              .generateToken(updateUser)
              .subscribe((response: any) => {
                this.cookieService.set("Token", response.token);
                localStorage.setItem("ImageUser", this.profileImage);
                location.reload();
              });
          });
      });
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }

  async scaleAndEncodeImage(file: File): Promise<string> {
    const width = 256;
    const height = 256;
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const scaledBase64 = canvas.toDataURL(file.type);
        resolve(scaledBase64);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = base64;
    });
  }

  onFileSelected(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => (this.profileImage = reader.result as string);
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.displayBase64(file);
    };
  }

  async displayBase64(file: File) {
    const base64 = await this.scaleAndEncodeImage(file);
    this.profileImage = base64;
  }
}
