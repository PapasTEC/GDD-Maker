import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class EditingDocumentService {

  private document = new BehaviorSubject<any>(null);
  document$ = this.document.asObservable();
  userEditing: string = null;
  private socket = io('http://localhost:3080');

  localUser = { email: "", name: "", image: "", owned_documents: [], shared_with_me_documents: [] };
  documentId = "";
  private timer: any;
  private countdownSeconds: number = 4;

  userEditingByComponent: any = {
    "Basic Information": null,
    "Technical Information": null,
    "Theme": null,
    "Aesthetic": null,
    "Core Mechanic": null,
    "Detail of the Core Mechanic": null,
    "Detail of the Secondary Mechanic": null,
    "Core Gameplay Loop": null,
    "Setting": null,
    "Characters": null,
    "Events": null,
    "Visual Style": null,
    "User Interface": null,
    "Music and Sound": null,
    "Game References": null
  };
  

  constructor() {
    this.socket.on('sync-data', ({ secId, subSecId, content }) => {
      // console.log("================ sync data ================ ");
      const document = this.document.getValue();
      document.documentContent[secId].subSections[subSecId] = content;
      this.document.next(document);

      // this.document.next(data);
    });
    this.socket.on('user-Editing', ({ content, user }) => {
      //console.log("user editing: ", user);
      //this.userEditing = user;
      console.log(`user editing: ${user} in section ${content}`)
      this.userEditingByComponent[content] = user;
      console.log(`List of user editing: ${JSON.stringify(this.userEditingByComponent)}`)
    })

  }
  changeDocument(document: any) {
    this.document.next(document)
  }

  updateUserEditing(userEditing: string) {
    clearTimeout(this.timer);

    this.socket.emit('edit-User', { documentId: this.documentId, content: userEditing, user: this.localUser.email });

    this.timer = setTimeout(() => {
      this.socket.emit('edit-User', { documentId: this.documentId, content: userEditing, user: null });
    }, 1000 * this.countdownSeconds);
  }

  joinDocument() {
    // console.log("join document");
    // console.log(this.documentId, this.localUser.email);
    this.socket.emit('join-document', this.documentId, this.localUser.email);
  }

  setUserData(user: any, documentId: any) {
    this.localUser = user;
    this.documentId = documentId;
  }

  addDocumentSection(section: any) {
    const document = this.document.getValue();
    document.documentContent.push({ sectionTitle: section, subSections: [] });
    this.document.next(document);
  }

  addDocumentSubSection(section: any, subSection: any, content: any) {
    const document = this.document.getValue();
    const secId = document.documentContent.findIndex((obj => obj.sectionTitle == section));
    document.documentContent[secId].subSections.push({ subSectionTitle: subSection, subSectionContent: content });
    this.document.next(document);
  }

  updateDocumentSubSection(section: any, subSection: any, content: any) {
    console.log(`subSection: ${subSection}`)
    this.updateUserEditing(subSection);

    const document = this.document.getValue();
    const secId = document.documentContent.findIndex((obj => obj.sectionTitle == section));
    const subSecId = document.documentContent[secId].subSections.findIndex((obj => obj.subSectionTitle == subSection));
    console.log(secId, subSecId);
    document.documentContent[secId].subSections[subSecId] = content;
    this.document.next(document);
    this.socket.emit('edit-document', { documentId: this.documentId, secId, subSecId, content });

  }

  updateDocumentFrontPage(content: any) {
    const document = this.document.getValue();
    document.frontPage = content;
    this.document.next(document);
  }

  updateDocumentSocket() {
    // this.socket.on('sync-data', (data: any) => {
    //   console.log("sync data");
    //   this.document.next(data);
    // });

    return this.document$;
  }

  disconnectSocket() {
    this.socket.disconnect();
  }
}
