import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DocumentService } from "src/app/services/document.service";
import { TokenService } from "src/app/services/token.service";
import { ToastrService } from "ngx-toastr";
import { ChangeDetectorRef } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: "app-share-document",
  templateUrl: "./share-document.component.html",
  styleUrls: ["./share-document.component.scss"],
})
export class ShareDocumentComponent implements OnInit {
  @Output() updateShowShareDocument: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() documentId: any;
  usersInDocument: any[];
  usersInDocumentObj: any[];

  usersObj: any = {};

  currentUserEmail: any;

  inputEmail: string = "";

  isOwner: boolean = false;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    private tokenService: TokenService,
    private documentService: DocumentService,
    private toastr: ToastrService,
    private editingDocumentService: EditingDocumentService,
    private clipboard: Clipboard
  ) {}
  currentUrl : string = "";
  readonlyURL: string = "";
  codeReadOnly: string = "";
  documentCode : any;

  ngOnInit() {
    this.documentService.getUsers(this.documentId).subscribe((data: any) => {
      this.usersObj = data;
      console.log(this.documentId, this.usersObj);
      this.tokenService.decodeToken().subscribe((data: any) => {
        console.log(`${JSON.stringify(data.decoded)}`);
        this.currentUserEmail = data.decoded.email;
        console.log(
          "this.currentUserEmail",
          this.currentUserEmail,
          "this.usersObj.owner",
          this.usersObj.owner
        );
        if (this.currentUserEmail === this.usersObj.owner.email) {
          this.isOwner = true;
        }
      });
    });

    this.editingDocumentService.onlineUsers$.subscribe((onlineUsers) => {
      console.log(`********************** Online users: `, onlineUsers);
      this.usersInDocumentObj = onlineUsers;
      this.usersInDocument = onlineUsers.map((user) => user.email);
    });

    this.currentUrl = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + window.location.pathname + window.location.search + window.location.hash;
    console.log("URL: ", this.currentUrl);
    this.documentCode = this.editingDocumentService.document$;
    console.log("Document code: ", this.documentCode);
    this.readonlyURL = this.currentUrl + "&readOnly=" + this.documentCode.source._value.codeReadOnly;
  }

  closeShareDocumentModal() {
    console.log(this.documentId, this.usersObj);
    this.updateShowShareDocument.emit(false);
  }

  // Give me method to copy to clipboard readonly link
  copyToClipboard() {
    this.clipboard.copy(this.readonlyURL);
    this.toastr.success("Copied to clipboard");
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
