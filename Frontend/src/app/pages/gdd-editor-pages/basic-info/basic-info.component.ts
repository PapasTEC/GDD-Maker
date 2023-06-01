import { Component } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { TokenService } from "src/app/services/token.service";
@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: [
    "./basic-info.component.scss",
    "../editorGlobalStyles.scss",
    "../vditor/vditor.component.scss",
    "../high_level_design/coreMechanic/coreMechanic.component.scss",
  ],
})
export class BasicInfoComponent {
  elevatorPitch = "";
  tagline = "";
  genres: string[] = [];
  tags: string[] = [];

  genreName: string;
  tagName: string;

  section: string;
  subSection: string;

  documentSubSection: any;

  basicInfo = { elevatorPitch: "", tagline: "", genres: [], tags: [] };

  route: ActivatedRoute;

  /* Collaborative Editing */
  isBlocked: any = {
    elevatorPitch: false,
    tagline: false,
    genres: false,
    tags: false,
  };

  isUserEditing: any = {
    elevatorPitch: false,
    tagline: false,
    genres: false,
    tags: false,
  };

  userBlocking: any = {
    elevatorPitch: null,
    tagline: null,
    genres: null,
    tags: null,
  };

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

  constructor(
    private editingDocumentService: EditingDocumentService,
    route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    this.route = route;
  }

  getSectionAndSubSection(route: ActivatedRoute) {
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
  }

  ngOnInit() {
    this.getSectionAndSubSection(this.route);

    /* NEW - COLLABORATIVE */
    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    if (this.editingDocumentService.read_only) {
      this.isBlocked = {
        elevatorPitch: true,
        tagline: true,
        genres: true,
        tags: true,
      };
    }

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {
        // if the user is editing the document, do not update the document
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeChanged("elevatorPitch");
        this.canBeChanged("tagline");
        this.canBeChanged("genres");
        this.canBeChanged("tags");

        // filter the document to get the section and subsection
        // and set the techInfo to the subSectionContent to update the information in real time
        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );


        // if (!this.isBlocked.elevatorPitch) {
        //   this.elevatorPitch =
        //     this.documentSubSection.subSectionContent.elevatorPitch;
        // }
        // if (!this.isBlocked.tagline) {
        //   this.tagline = this.documentSubSection.subSectionContent.tagline;
        // }
        // if (!this.isBlocked.genres) {
        //   this.genres = this.documentSubSection.subSectionContent.genres;
        // }
        // if (!this.isBlocked.tags) {
        //   this.tags = this.documentSubSection.subSectionContent.tags;
        // }
        const userEditing =
        this.editingDocumentService.userEditingByComponent[this.subSection];

        if (userEditing.elevatorPitch?.email !== this.localUser) {
          this.elevatorPitch = this.documentSubSection.subSectionContent.elevatorPitch;
        }
        if (userEditing.tagline?.email !== this.localUser) {
          this.tagline = this.documentSubSection.subSectionContent.tagline;
        }
        if (userEditing.genres?.email !== this.localUser) {
          this.genres = this.documentSubSection.subSectionContent.genres;
        }
        if (userEditing.tags?.email !== this.localUser) {
          this.tags = this.documentSubSection.subSectionContent.tags;
        }

        console.log("Update", this.documentSubSection);
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

        this.elevatorPitch =
          this.documentSubSection.subSectionContent.elevatorPitch;
        this.tagline = this.documentSubSection.subSectionContent.tagline;
        this.genres = this.documentSubSection.subSectionContent.genres;
        this.tags = this.documentSubSection.subSectionContent.tags;

        console.log(this.documentSubSection);

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
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];

    for (const key in this.isUserEditing) {
      if (this.isUserEditing.hasOwnProperty(key)) {
        this.isUserEditing[key] =
          userEditing[key] && userEditing[key]?.email !== this.localUser;
        this.isBlocked[key] = this.isUserEditing[key] || this.editingDocumentService.read_only;
        if (this.isUserEditing[key]) {
          this.userBlocking[key] = userEditing[key];
        }
      }
    }
  }

  updateDocument(part: string, event?: any) {
    this.myInput = true;
    if (!this.canBeChanged(part)) {
      if (event) {
        event.preventDefault();
      }
      return;
    }

    this.basicInfo.elevatorPitch = this.elevatorPitch;
    this.basicInfo.tagline = this.tagline;
    this.basicInfo.genres = this.genres;
    this.basicInfo.tags = this.tags;

    // console.log("Basic Info: ", this.basicInfo);
    this.documentSubSection.subSectionContent = this.basicInfo;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection,
      part
    );
  }

  public canBeChanged(part: string): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing[part] = userEditing[part] && userEditing[part].email !== this.localUser;
    this.isBlocked[part] = this.isUserEditing[part] || this.editingDocumentService.read_only;
    if (this.isUserEditing[part]) {
      this.userBlocking[part] = userEditing[part];
    }
    return !this.isBlocked[part];
  }

  public addGenre(): void {
    if (!this.canBeChanged("genres")) {
      return;
    }
    var genreTextBox = document.getElementById("genreText") as HTMLInputElement;
    if (genreTextBox.value == "") {
      return;
    }
    const repeated = this.genres.find((val) => val == genreTextBox.value);
    if (repeated) {
      return;
    }
    this.genres.push(genreTextBox.value);
    genreTextBox.value = "";
    // console.log("genres:", this.genres);
    //this.updateStorage();

    this.updateDocument("genres");
  }

  public deleteGenre(id: number): void {
    if (!this.canBeChanged("genres")) {
      return;
    }
    // Delete at index
    this.genres.splice(id, 1);
    // console.log(this.genres);
    // this.updateDocument();
    this.updateDocument("genres");
    //this.updateStorage();
  }

  public addTag(): void {
    if (!this.canBeChanged("tags")) {
      return;
    }
    var tagTextBox = document.getElementById("tagText") as HTMLInputElement;
    if (tagTextBox.value == "") {
      return;
    }
    const repeated = this.tags.find((val) => val == tagTextBox.value);
    if (repeated) {
      return;
    }
    this.tags.push(tagTextBox.value);
    tagTextBox.value = "";
    this.updateDocument("tags");
    // console.log("tags:", this.tags);
    //this.updateStorage();
    // this.updateDocument();
  }
  public deleteTag(id: number): void {
    if (!this.canBeChanged("tags")) {
      return;
    }
    // Delete at index
    this.tags.splice(id, 1);
    // console.log(this.tags);
    //this.updateStorage();
    // this.updateDocument();
    this.updateDocument("tags");
  }

  onChangeBlock(event: any, part: string) {
    if (!this.canBeChanged(part)) {
      event.preventDefault();
      return;
    }
  }
}
