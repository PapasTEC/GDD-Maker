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

  public read_only = null;

  documentSections: any = [
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

  userEditingByComponent: any = {
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
    this.socket = io("http://129.159.124.235:3080");
    this.socket.on("connect", () => {
      this.isConnected = true;
    });

    this.socket.on("sync-data", ({ secId, subSecId, content, part }) => {
      const document = this.document.getValue();

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

        if (Object.hasOwn(subParts, content.subSectionTitle)) {
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
    });

    this.socket.on("sync-data-front-page", ({ content }) => {
      const document = this.document.getValue();
      document.frontPage = content;
      this.document.next(document);
    });

    this.socket.on("user-Editing", ({ content, user, part }) => {
      if (user == null) {
        if (part != null) {
          this.userEditingByComponent[content][part] = null;

          return;
        } else {
          this.userEditingByComponent[content] = null;

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
    });

    this.socket.on("update-online-users", (onlineUsers) => {
      this.onlineUsers.next(onlineUsers);
    });
  }

  setReadOnly(read_only: string) {
    this.read_only = read_only;
  }

  getOnlineUsers() {
    return this.onlineUsers$;
  }

  changeDocument(document: any) {
    this.document.next(document);
  }

  updateUserEditing(userEditing: string, part?: string) {
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
    this.updateUserEditing(subSection, part || null);

    const document = this.document.getValue();
    const secId = document.documentContent.findIndex(
      (obj) => obj.sectionTitle == section
    );
    const subSecId = document.documentContent[secId].subSections.findIndex(
      (obj) => obj.subSectionTitle == subSection
    );

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
  }

  ngOnDestroy() {
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
