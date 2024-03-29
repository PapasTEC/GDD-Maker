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
  isUserEditing: boolean = false;

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
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked =
      this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
    return !this.isBlocked;
  }

  ngOnInit() {
    /* NEW - COLLABORATIVE */
    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.canBeEdited();

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited();

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

        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();
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
        this.coreMechanicContent[index] = value;

        this.updateDocument(this.coreMechanicContent);
      },
      theme: "dark",
    };
  }
}
