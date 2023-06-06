import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { filter, map, take } from "rxjs";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { TokenService } from "src/app/services/token.service";

@Component({
  selector: "app-technical-info",
  templateUrl: "./technical-info.component.html",
  styleUrls: ["./technical-info.component.scss", "../editorGlobalStyles.scss"],
})
export class TechnicalInfoComponent {
  platforms = [
    { name: "Android", image: "../../assets/img/platformIcons/android.png" },
    { name: "iOS", image: "../../assets/img/platformIcons/ios.png" },
    { name: "Web", image: "../../assets/img/platformIcons/web.png" },
    { name: "Linux", image: "../../assets/img/platformIcons/linux.png" },
    { name: "MacOS", image: "../../assets/img/platformIcons/mac.png" },
    { name: "Windows", image: "../../assets/img/platformIcons/windows.png" },
    {
      name: "Playstation",
      image: "../../assets/img/platformIcons/playstation.png",
    },
    { name: "Xbox", image: "../../assets/img/platformIcons/xbox.png" },
    {
      name: "Nintendo Switch",
      image: "../../assets/img/platformIcons/switch.png",
    },
  ];

  section: any;
  subSection: any;
  documentSubSection: any;
  techInfo = {
    platforms: [],
    ageClassification: "",
    targetAudience: "",
    releaseDate: "",
    price: "",
  };
  today: Date = new Date();

  /* Collaborative Editing */
  isBlocked: any = {
    platforms: false,
    generalData: false,
  };

  userBlocking: any = {
    platforms: null,
    generalData: null,
  };

  isUserEditing: any = {
    platforms: null,
    generalData: null,
  };

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

  constructor(
    private editingDocumentService: EditingDocumentService,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {}

  getSectionAndSubSection() {
    this.route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
  }

  public canBeEdited(part: string): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing[part] = userEditing[part] && userEditing[part].email !== this.localUser;
    this.isBlocked[part] = this.isUserEditing[part] || this.editingDocumentService.read_only;
    if (this.isUserEditing[part]) {
      this.userBlocking[part] = userEditing[part];
    }
    return !this.isBlocked[part];
  }

  ngOnInit() {
    this.getSectionAndSubSection();

    if (this.editingDocumentService.read_only) {
      this.isBlocked = {
        platforms: true,
        generalData: true,
      };
    }

    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {

        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited("platforms");
        this.canBeEdited("generalData");



        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );


        const userEditing =
        this.editingDocumentService.userEditingByComponent[this.subSection];

        if (userEditing.platforms?.email !== this.localUser) {
          this.techInfo.platforms = this.documentSubSection.subSectionContent.platforms;
        }
        if (userEditing.generalData?.email !== this.localUser) {
          this.techInfo.ageClassification = this.documentSubSection.subSectionContent.ageClassification;
          this.techInfo.targetAudience = this.documentSubSection.subSectionContent.targetAudience;
          this.techInfo.releaseDate = this.documentSubSection.subSectionContent.releaseDate;
          this.techInfo.price = this.documentSubSection.subSectionContent.price;
        }




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
        this.techInfo = document.subSectionContent;



        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);

      });
  }

  updateIsBlocked1s() {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];

    this.isUserEditing.platforms =
      userEditing.platforms && userEditing.platforms.email !== this.localUser;
    this.isBlocked.platforms = this.isUserEditing.platforms || this.editingDocumentService.read_only;
    if (this.isUserEditing.platforms) {
      this.userBlocking.platforms = userEditing.platforms;
    }

    this.isUserEditing.generalData =
      userEditing.generalData &&
      userEditing.generalData.email !== this.localUser;
    this.isBlocked.generalData = this.isUserEditing.generalData || this.editingDocumentService.read_only;
    if (this.isUserEditing.generalData) {
      this.userBlocking.generalData = userEditing.generalData;
    }
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();

  }

  onPlatformsChange(event: KeyboardEvent): void {
    if (!this.canBeEdited("platforms")) {
      event.preventDefault();
    }
  }

  onGeneralDataChange(event: KeyboardEvent): void {
    if (!this.canBeEdited("generalData")) {
      event.preventDefault();
    }
  }

  updateDocument(part: string) {

    this.myInput = true;

    this.documentSubSection.subSectionContent = this.techInfo;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection,
      part
    );
  }

  public addOrRemove(platformID: number) {
    if (!this.canBeEdited("platforms")) {
      return;
    }

    if (this.techInfo.platforms.includes(platformID)) {
      this.techInfo.platforms.splice(
        this.techInfo.platforms.indexOf(platformID),
        1
      );
    } else {
      this.techInfo.platforms.push(platformID);
    }
    this.updateDocument("platforms");
  }

  updateGeneralData(event: KeyboardEvent) {

    if (!this.canBeEdited("generalData")) {
      event.preventDefault();
      return;
    }
    this.updateDocument("generalData");
  }

  onChangeBlock(event: any, part: string) {
    if (!this.canBeEdited(part)) {
      event.preventDefault();
      return;
    }
  }
}
