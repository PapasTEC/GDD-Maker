import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, forkJoin } from "rxjs";
import { io } from "socket.io-client";
import { apiSocket } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class EditingDocumentService {
  private document = new BehaviorSubject<any>(null);
  document$ = this.document.asObservable();

  private onlineUsers = new BehaviorSubject<any>(null);
  onlineUsers$ = this.onlineUsers.asObservable();

  userEditing: string = null;
  public isConnected: boolean = false;
  private socket = null;

  documentSections: any = [
    //["Document Cover"],
    ["Basic Information"],
    ["Technical Information"],
    ["Theme", "Aesthetic", "Core Mechanic"],
    [
      "Detail of the Core Mechanic",
      "Detail of the Secondary Mechanic",
      "Core Gameplay Loop",
    ],
    ["Setting", "Characters", "Events"],
    ["Visual Style", "User Interface", "Music and Sound"],
    ["Game References"],
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
      tags: null,
    },
    "Technical Information": {
      platforms: null,
      generalData: null,
    },
    Theme: null,
    Aesthetic: null,
    "Core Mechanic": null,
    "Detail of the Core Mechanic": {
      representation: null,
      decisions: null,
      goals: null,
    },
    "Detail of the Secondary Mechanic": null,
    "Core Gameplay Loop": null,
    Setting: null,
    Characters: null,
    Events: null,
    "Visual Style": null,
    "User Interface": null,
    "Music and Sound": null,
    "Game References": null,
  };

  currentUserEditing: any = null;

  partsTimers: any = new Map();

  // private socket = io('http://129.159.124.235:3080');

  localUser = {
    email: "",
    name: "",
    image: "",
    owned_documents: [],
    shared_with_me_documents: [],
  };
  documentId = "";
  private timer: any;
  private countdownSeconds: number = 4;

  constructor() {
    this.socket = io(apiSocket);
    this.socket.on("connect", () => {
      this.isConnected = true;
      console.log("Conectado al servidor Socket.IO");
    });

    this.socket.on("sync-data", ({ secId, subSecId, content, part }) => {
      console.log("================ sync data ================ ");
      const document = this.document.getValue();
      console.log(secId, subSecId, content);
      console.log(document);
      console.log(document.documentContent[secId]);
      console.log(document.documentContent[secId].subSections[subSecId]);
      console.log(part);

      if (part) {
        let subParts = {
          "Technical Information": {
            platforms: ["platforms"],
            generalData: [
              "ageClassification",
              "targetAudience",
              "releaseDate",
              "price",
            ],
          },
          "Detail of the Core Mechanic": {
            representation: ["tokens", "resources", "additionalElements"],
            decisions: ["decisions"],
            goals: ["intermediate", "local", "global"],
          },
        };

        // if (content.subSectionTitle === 'Technical Information' && part === "generalData") {
        //   console.log("UPDATE generalData")
        //   document.documentContent[secId].subSections[subSecId].subSectionContent["ageClassification"] = content.subSectionContent["ageClassification"];
        //   document.documentContent[secId].subSections[subSecId].subSectionContent["targetAudience"] = content.subSectionContent["targetAudience"];
        //   document.documentContent[secId].subSections[subSecId].subSectionContent["releaseDate"] = content.subSectionContent["releaseDate"];
        //   document.documentContent[secId].subSections[subSecId].subSectionContent["price"] = content.subSectionContent["price"];
        // }
        if (Object.hasOwn(subParts, content.subSectionTitle)) {
          console.log("UPDATE", content.subSectionTitle, part);
          for (let subPart of subParts[content.subSectionTitle][part]) {
            document.documentContent[secId].subSections[
              subSecId
            ].subSectionContent[subPart] = content.subSectionContent[subPart];
          }
        } else {
          document.documentContent[secId].subSections[
            subSecId
          ].subSectionContent[part] = content.subSectionContent[part];
        }
      } else {
        document.documentContent[secId].subSections[subSecId] = content;
      }
      console.log(
        "NEW SUBSECTION",
        document.documentContent[secId].subSections[subSecId]
      );
      document.socketSubSection = this.documentSections[secId][subSecId];
      this.document.next(document);

      // this.document.next(data);
    });

    this.socket.on("sync-data-front-page", ({ content }) => {
      console.log("================ sync data front page ================ ");
      const document = this.document.getValue();
      document.frontPage = content;
      this.document.next(document);
    });

    this.socket.on("user-Editing", ({ content, user, part }) => {
      //console.log("user editing: ", user);
      //this.userEditing = user;
      //console.log(`user editing: ${user} in section ${content}`)
      // this.userEditingByComponent[content] = user;
      // use onlineUsers to get the user editing by their email
      if (user == null) {
        if (part != null) {
          this.userEditingByComponent[content][part] = null;
          console.log("UserEditingByComponent", this.userEditingByComponent);
          return;
        } else {
          this.userEditingByComponent[content] = null;
          console.log("UserEditingByComponent", this.userEditingByComponent);
          return;
        }
      }
      if (part != null) {
        this.userEditingByComponent[content][part] = this.onlineUsers
          .getValue()
          .find((userOnline) => userOnline.email == user) || {
          email: user,
          name: user,
          image: null,
        };
      } else {
        this.userEditingByComponent[content] = this.onlineUsers
          .getValue()
          .find((userOnline) => userOnline.email == user) || {
          email: user,
          name: user,
          image: null,
        };
      }
      console.log("UserEditingByComponent", this.userEditingByComponent); //console.log(`List of user editing: ${JSON.stringify(this.userEditingByComponent)}`)
    });

    this.socket.on("update-online-users", (onlineUsers) => {
      console.log(`********************** Online users: `, this.onlineUsers);
      this.onlineUsers.next(onlineUsers);
    });
  }

  getOnlineUsers() {
    return this.onlineUsers$;
  }

  changeDocument(document: any) {
    this.document.next(document);
  }

  updateUserEditing(userEditing: string, part?: string) {
    // clearTimeout(this.timer);

    this.socket.emit("edit-User", {
      documentId: this.documentId,
      content: userEditing,
      user: this.localUser.email,
      part: part,
    });

    if (part) {
      if (this.partsTimers.has(part)) {
        clearTimeout(this.partsTimers.get(part));
      }
      this.partsTimers.set(
        part,
        setTimeout(() => {
          this.socket.emit("edit-User", {
            documentId: this.documentId,
            content: userEditing,
            user: null,
            part: part,
          });
        }, 1000 * this.countdownSeconds)
      );
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.socket.emit("edit-User", {
          documentId: this.documentId,
          content: userEditing,
          user: null,
          part: part,
        });
      }, 1000 * this.countdownSeconds);
    }
  }

  joinDocument() {
    // console.log("join document");
    // console.log(this.documentId, this.localUser.email);
    this.socket.emit("join-document", this.documentId, this.localUser);
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
    const secId = document.documentContent.findIndex(
      (obj) => obj.sectionTitle == section
    );
    document.documentContent[secId].subSections.push({
      subSectionTitle: subSection,
      subSectionContent: content,
    });
    this.document.next(document);
  }

  updateDocumentSubSection(
    section: any,
    subSection: any,
    content: any,
    part?: string
  ) {
    // console.log(`subSection: ${subSection}`)
    this.updateUserEditing(subSection, part || null);

    const document = this.document.getValue();
    const secId = document.documentContent.findIndex(
      (obj) => obj.sectionTitle == section
    );
    const subSecId = document.documentContent[secId].subSections.findIndex(
      (obj) => obj.subSectionTitle == subSection
    );
    console.log(secId, subSecId);
    document.documentContent[secId].subSections[subSecId] = content;
    this.document.next(document);
    this.socket.emit("edit-document", {
      documentId: this.documentId,
      secId,
      subSecId,
      content,
      sectionTitle: section,
      subSectionTitle: subSection,
      part,
    });
  }

  updateDocumentFrontPage(content: any) {
    this.updateUserEditing("Document Cover");
    const document = this.document.getValue();
    document.frontPage = content;
    this.document.next(document);
    this.socket.emit("edit-document-front-page", {
      documentId: this.documentId,
      content,
    });
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
    this.socket.emit("leave-document", this.documentId, this.localUser.email);
    this.isConnected = false;
    this.socket.disconnect();
  }

  connectSocket() {
    if (!this.isConnected) {
      this.socket.connect();
    }
  }
}
