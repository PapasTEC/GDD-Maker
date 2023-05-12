import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DocumentService } from "src/app/services/document.service";
import { TokenService } from "src/app/services/token.service";
import { ToastrService } from "ngx-toastr";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app-share-document",
  templateUrl: "./share-document.component.html",
  styleUrls: ["./share-document.component.scss"],
})
export class ShareDocumentComponent implements OnInit {
  @Output() updateShowShareDocument: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() documentId: any;

  usersObj: any = {};

  currentUserEmail: any;

  inputEmail: string = "";

  isOwner: boolean = false;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private tokenService: TokenService,
    private documentService: DocumentService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.tokenService.decodeToken().subscribe((data: any) => {
      console.log(`${JSON.stringify(data.decoded)}`);
      this.currentUserEmail = data.decoded.email;
    });

    this.documentService.getUsers(this.documentId).subscribe((data: any) => {
      this.usersObj = data;
      console.log(this.documentId, this.usersObj);
    });

    if (this.currentUserEmail == this.usersObj.owner) {
      this.isOwner = true;
    }
  }

  closeShareDocumentModal() {
    console.log(this.documentId, this.usersObj);

    this.updateShowShareDocument.emit(false);
  }

  updateInput(event: any) {
    console.log(event.target.value);
    this.inputEmail = event.target.value;
  }

  inviteUser() {
    // validate email using regex
    if (!this.inputEmail.match(/^\S+@\S+\.\S+$/)) {
      this.toastr.error("Invalid email");
      return;
    }
    this.documentService
      .inviteUser(this.documentId, this.inputEmail)
      .subscribe((data: any) => {
        console.log(data);
        if (data.success) {
          this.toastr.success(data.message);
          this.usersObj = data.users;
          this.inputEmail = "";
        } else {
          // this.toastr.error(data.error);
          if (data.error) {
            this.toastr.error(data.error);
          } else {
            this.toastr.error(data.message);
          }
        }
      });
  }

  removeUser(email: any) {
    console.log(email);
    let message: string = "";
    this.documentService
      .removeUser(this.documentId, email)
      .subscribe((data: any) => {
        // console.log(data);
        // this.usersObj = data;
        let success = false;
        message = data.message;
        if (data.users) {
          this.usersObj = data.users;
          console.log(data.users);
          success = true;
          this.toastr.success(message);
        } else {
          success = false;
          this.toastr.error(message);
        }
      });

    this.changeDetectorRefs.detectChanges();
    // this.toastr.success('');
  }
}
