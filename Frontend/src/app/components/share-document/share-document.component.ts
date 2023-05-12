import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DocumentService } from "src/app/services/document.service";
import { TokenService } from "src/app/services/token.service";

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

  isOwner: boolean = false;

  constructor(private tokenService: TokenService, private documentService: DocumentService) {}

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

  removeUser(email: any) {
    console.log(email);

    this.documentService
      .removeUser(this.documentId, email)
      .subscribe((data: any) => {
        // console.log(data);
        // this.usersObj = data;
        let success = false;
        if (data.users) {
          this.usersObj.users = data.users;
          success = true;
        }
        else {
          success = false;
        }
      });
  }

}
