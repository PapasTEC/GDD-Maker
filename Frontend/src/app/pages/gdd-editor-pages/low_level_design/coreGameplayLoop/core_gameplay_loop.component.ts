import { Component, ViewEncapsulation } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { ActivatedRoute } from "@angular/router";
import { filter, map, take } from "rxjs/operators";
import { TokenService } from "src/app/services/token.service";

@Component({
  selector: "app-core_gameplay_loop",
  templateUrl: "./core_gameplay_loop.component.html",
  styleUrls: [
    "../../editorGlobalStyles.scss",
    "../../vditor/vditor.component.scss",
    "./core_gameplay_loop.component.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CoreGameplayLoopComponent {
    /* Collaborative Editing */
    isBlocked: boolean = false;

    userBlocking: any = null;

    localUser = null;
    decodeToken: any;
    updateSocket: any;
    myInput: boolean = false;
    updateBlockedInterval: any = null;

  constructor(
    private editingDocumentService: EditingDocumentService,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    this.route = route;
  }

  coreGameplayLoopContent = {
    first: "",
    second: "",
    third: "",
    fourth: "",
  };

  section = "Low Level Design";
  subSection = "Core Gameplay Loop";
  documentSubSection: any;

  updateDocument(coreGameplayLoopContent: any) {
    this.myInput = true;
    this.documentSubSection.subSectionContent = coreGameplayLoopContent;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }


  public canBeEdited(): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isBlocked = userEditing && userEditing.email !== this.localUser;
    if (this.isBlocked) {
      this.userBlocking = userEditing;
    }
    return !this.isBlocked;
  }

  ngOnInit() {
    // this.editingDocumentService.document$
    //   .pipe(
    //     filter((document) => document),
    //     map((document) =>
    //       document.documentContent
    //         .find((section) => section.sectionTitle === this.section)
    //         .subSections.find(
    //           (subsection) => subsection.subSectionTitle === this.subSection
    //         )
    //     ),
    //     take(1)
    //   )
    //   .subscribe((document) => {
    //     this.documentSubSection = document;
    //     this.coreGameplayLoopContent =
    //       this.documentSubSection.subSectionContent;
    //     console.log("coreGameplayLoopContent:", this.coreGameplayLoopContent);
    //   });
    /* NEW - COLLABORATIVE */
    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {
        // if the user is editing the document, do not update the document
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited();

        // filter the document to get the section and subsection
        // and set the techInfo to the subSectionContent to update the information in real time
        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );

        this.coreGameplayLoopContent = this.documentSubSection.subSectionContent;
        // this.aestheticsInDocument = this.documentSubSection.subSectionContent.aesthetics;

        // this.cardsInDocument = this.aestheticsInDocument.length;
      });

    this.editingDocumentService.document$
      .pipe(
        filter((document) => document !== null),
        map((document) =>
          document.documentContent
            .find((section) => section.sectionTitle === this.section)
            .subSections.find(
              (subsection) => subsection.subSectionTitle === this.subSection
            )
        ),
        take(1)
      )
      .subscribe((document) => {
        this.documentSubSection = document;

        this.coreGameplayLoopContent = this.documentSubSection.subSectionContent;

        console.log(this.documentSubSection);

        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  updateIsBlocked1s() {
    this.canBeEdited();
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();
    // if (this.editingDocumentService) this.editingDocumentService.unsubscribe();
  }


  onValueChange(event: Event, name: string): void {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
    // console.log(event.target);
    const value = (event.target as any).value;
    this.coreGameplayLoopContent[name] = value;
    // console.log("coreGameplayLoopContent:", this.coreGameplayLoopContent);
    this.updateDocument(this.coreGameplayLoopContent);
  }

  onChangeBlock(event: any) {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
  }
}
