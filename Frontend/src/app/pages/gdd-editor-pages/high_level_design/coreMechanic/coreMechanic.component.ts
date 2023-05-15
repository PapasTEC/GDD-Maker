import { Component } from "@angular/core";
import Vditor from "vditor";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { TokenService } from "src/app/services/token.service";

@Component({
  selector: "app-coreMechanic",
  templateUrl: "./coreMechanic.component.html",
  styleUrls: ["./coreMechanic.component.scss"],
})
export class CoreMechanicComponent {
  vditor1: Vditor | null = null;
  vditor2: Vditor | null = null;
  vditor3: Vditor | null = null;
  vditor4: Vditor | null = null;
  coreMechanicContent = {
    coreMechanic: "",
    secondary: "",
    progression: "",
    metaphore: "",
  };

  section = "High Level Design";
  subSection = "Core Mechanic";
  documentSubSection: any;

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
    private tokenService: TokenService
  ) {}

  updateDocument(coreMechanicContent: any) {
    if (!this.canBeEdited()) {
      return;
    }
    this.myInput = true;
    console.log("coreMechanicContents: ", coreMechanicContent);
    this.documentSubSection.subSectionContent = coreMechanicContent;
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
    //     filter((document) => document !== null),
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
    //     this.coreMechanicContent = this.documentSubSection.subSectionContent;
    //     console.log("coreMechanicContent:", this.coreMechanicContent);
    //     (this.vditor1 = new Vditor(
    //       "vditor1",
    //       this.changeVditorConfig(
    //         "Metaphore...",
    //         this.coreMechanicContent["metaphore"],
    //         "metaphore"
    //       )
    //     )),
    //       (this.vditor2 = new Vditor(
    //         "vditor2",
    //         this.changeVditorConfig(
    //           "Progression...",
    //           this.coreMechanicContent["progression"],
    //           "progression"
    //         )
    //       ));
    //     this.vditor3 = new Vditor(
    //       "vditor3",
    //       this.changeVditorConfig(
    //         "Secondary...",
    //         this.coreMechanicContent["secondary"],
    //         "secondary"
    //       )
    //     );
    //     this.vditor4 = new Vditor(
    //       "vditor4",
    //       this.changeVditorConfig(
    //         "Core Mechanic...",
    //         this.coreMechanicContent["coreMechanic"],
    //         "coreMechanic"
    //       )
    //     );
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

        this.vditor1.setValue(
          this.documentSubSection.subSectionContent["metaphore"]
        );
        this.vditor2.setValue(
          this.documentSubSection.subSectionContent["progression"]
        );
        this.vditor3.setValue(
          this.documentSubSection.subSectionContent["secondary"]
        );
        this.vditor4.setValue(
          this.documentSubSection.subSectionContent["coreMechanic"]
        );

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

        this.coreMechanicContent = this.documentSubSection.subSectionContent;

        this.vditor1 = new Vditor(
          "vditor1",
          this.changeVditorConfig(
            "Metaphore...",
            this.coreMechanicContent["metaphore"],
            "metaphore"
          )
        );

        this.vditor2 = new Vditor(
          "vditor2",
          this.changeVditorConfig(
            "Progression...",
            this.coreMechanicContent["progression"],
            "progression"
          )
        );

        this.vditor3 = new Vditor(
          "vditor3",
          this.changeVditorConfig(
            "Secondary...",
            this.coreMechanicContent["secondary"],
            "secondary"
          )
        );

        this.vditor4 = new Vditor(
          "vditor4",
          this.changeVditorConfig(
            "Core Mechanic...",
            this.coreMechanicContent["coreMechanic"],
            "coreMechanic"
          )
        );

        console.log(this.documentSubSection);

        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  updateIsBlocked1s() {
    this.canBeEdited();
  }

  onChange(event: KeyboardEvent): void {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
  }

  changeVditorConfig(
    placeholder: string,
    content: string,
    index: string
  ): IOptions {
    return {
      value: content,
      placeholder: placeholder,
      toolbar: [],
      lang: "en_US",
      mode: "ir",
      cache: {
        enable: false,
      },
      after: () => {},
      input: (value: string) => {
        // console.log("value: ", value);
        this.coreMechanicContent[index] = value;
        // console.log("coreMechanicContent: ", this.coreMechanicContent);
        this.updateDocument(this.coreMechanicContent);
      },
      theme: "dark",
    };
  }
}
