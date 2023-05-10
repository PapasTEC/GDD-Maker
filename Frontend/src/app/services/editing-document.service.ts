import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';
import { apiSocket } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditingDocumentService {

  private document = new BehaviorSubject<any>(null);
  document$ = this.document.asObservable();
  userEditing: string = null;
  private socket = io(apiSocket);

  // private socket = io('http://129.159.124.235:3080');


  localUser = {email: "", name: "", image: "", owned_documents: [], shared_with_me_documents: [] };
  documentId = "";
  private timer: any;
  private countdownSeconds: number = 4;

  constructor() {
    this.socket.on('sync-data', ({secId, subSecId, content}) => {
      // console.log("================ sync data ================ ");
      const document = this.document.getValue();
      document.documentContent[secId].subSections[subSecId] = content;
      this.document.next(document);

      // this.document.next(data);
    });
    this.socket.on('user-Editing', ({user}) => {
      console.log("user editing: ", user);
      this.userEditing = user;
    })

   }
  changeDocument(document: any) {
    this.document.next(document)
  }

  updateUserEditing() {
    clearTimeout(this.timer);

    this.socket.emit('edit-User', { documentId: this.documentId, user: this.localUser.email });
  
    this.timer = setTimeout(() => {
      this.socket.emit('edit-User', { documentId: this.documentId, user: null });
    }, 1000 * this.countdownSeconds);
  }

  joinDocument() {
    console.log("join document");
    console.log(this.documentId, this.localUser.email);
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
    const document = this.document.getValue();
    const secId = document.documentContent.findIndex((obj => obj.sectionTitle == section));
    const subSecId = document.documentContent[secId].subSections.findIndex((obj => obj.subSectionTitle == subSection));
    console.log(secId, subSecId);
    document.documentContent[secId].subSections[subSecId] = content;
    this.document.next(document);
    this.socket.emit('edit-document', {documentId: this.documentId, secId, subSecId, content});
    
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
