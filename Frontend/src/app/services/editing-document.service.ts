import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { io } from 'socket.io-client';
import { apiSocket } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditingDocumentService {

  private document = new BehaviorSubject<any>(null);
  document$ = this.document.asObservable();

  userEditing: string = null;
  public isConnected: boolean = false;
  private socket = null;

  documentSections: any = [
    //["Document Cover"],
    ["Basic Information"],
    ["Technical Information"],
    ["Theme", "Aesthetic", "Core Mechanic"],
    ["Detail of the Core Mechanic", "Detail of the Secondary Mechanic", "Core Gameplay Loop"],
    ["Setting", "Characters", "Events"],
    ["Visual Style", "User Interface", "Music and Sound"],
    ["Game References"]
  ];

  // documentSections: any = {
  //   cover: "Document Cover",
  //   basicInfo: "Basic Information",
  //   techInfo: "Technical Information",
  //   highLevel: {
  //     theme: "Theme",
  //     aesthetic: "Aesthetic",
  //     coreMechanic: "Core Mechanic",
  //   },
  //   lowLevel: {
  //     detailCoreMechanic: "Detail of the Core Mechanic",
  //     secondaryCoreMechanic: "Detail of the Secondary Mechanic",
  //     gameplayLoop: "Core Gameplay Loop"
  //   },
  //   NarAndWorld: {
  //     setting: "Setting",
  //     characters: "Characters",
  //     events: "Events"
  //   },
  //   visualStyle: "Visual Style",
  //   userInterface: "User Interface",
  //   musicSound: "Music and Sound",
  //   gameReferences: "Game References"
  // };

  userEditingByComponent: any = {
    // "Document Cover": {
    //   title: null,
    //   companyName: null,
    //   collaborators: null
    // },
    "Document Cover": null,
    "Basic Information": {
      elevatorPitch: null,
      tagline: null,
      genres: null,
      tags: null
    },
    "Technical Information": {
      platforms: null,
      generalData: null
    },
    "Theme": null,
    "Aesthetic": null,
    "Core Mechanic": null,
    "Detail of the Core Mechanic": {
      representation: null,
      decisions: null,
      goals: null
    },
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

  // private socket = io('http://129.159.124.235:3080');


  localUser = { email: "", name: "", image: "", owned_documents: [], shared_with_me_documents: [] };
  documentId = "";
  private timer: any;
  private countdownSeconds: number = 4;

  constructor() {
    this.socket = io(apiSocket);
    this.socket.on('connect', () => {
      this.isConnected = true;
      console.log('Conectado al servidor Socket.IO');
    });

    this.socket.on('sync-data', ({ secId, subSecId, content }) => {
      console.log("================ sync data ================ ");
      const document = this.document.getValue();
      document.documentContent[secId].subSections[subSecId] = content;
      document.socketSubSection = this.documentSections[secId][subSecId];
      this.document.next(document);

      // this.document.next(data);
    });
    this.socket.on('user-Editing', ({ content, user }) => {
      //console.log("user editing: ", user);
      //this.userEditing = user;
      //console.log(`user editing: ${user} in section ${content}`)
      this.userEditingByComponent[content] = user;
      //console.log(`List of user editing: ${JSON.stringify(this.userEditingByComponent)}`)
    })

  }
  // connect(){
  //   if (this.isConnected) {
  //     return;
  //   }
    
  // }

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
    // console.log(`subSection: ${subSection}`)
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
    return this.document$;
    // console.log("update document socket");
    //return forkJoin([this.document$, this.currentSocketUpdateSubsection$]);
    // return forkJoin(this.document$,;
    //return this.currentSocketUpdateSubsection$;
  }

  ngOnDestroy() {
    console.log("destroy");
    this.socket.disconnect();
  }


  disconnectSocket() {
    this.isConnected = false;
    this.socket.disconnect();
  }

  connectSocket() {
    if (!this.isConnected) {
      this.socket.connect();
    }
  }
}
