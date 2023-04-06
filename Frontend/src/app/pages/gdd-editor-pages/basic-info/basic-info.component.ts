import { Component } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
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

  section:string;
  subSection:string;

  documentSubSection:any;

  basicInfo = { elevatorPitch: "", tagline: "", genres: [], tags: [] };


  route : ActivatedRoute;
  constructor(private editingDocumentService: EditingDocumentService, route: ActivatedRoute) { this.route = route; }

  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
    
  }

  ngOnInit(){

    this.getSectionAndSubSection(this.route);

    console.log("section: ", this.section);
    console.log("subSection: ", this.subSection);

    // this.addDocSectionIfItDoesntExist(this.section);
    // this.addDocSubSectionIfItDoesntExist(this.section, this.subSection, {characters: []} );

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
      ).subscribe((document) => {
        this.documentSubSection = document;
        this.elevatorPitch = document.subSectionContent.elevatorPitch;
        this.tagline = document.subSectionContent.tagline;
        this.genres = document.subSectionContent.genres;
        this.tags = document.subSectionContent.tags;
    });
  }

  updateDocument() {
    this.basicInfo.elevatorPitch = this.elevatorPitch;
    this.basicInfo.tagline = this.tagline;
    this.basicInfo.genres = this.genres;
    this.basicInfo.tags = this.tags;

    console.log("Basic Info: ", this.basicInfo);
    this.documentSubSection.subSectionContent = this.basicInfo;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }


  


  public addGenre(): void {
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
    console.log("genres:", this.genres);
    //this.updateStorage();
    this.updateDocument();
  }
  public deleteGenre(id: number): void {
    // Delete at index
    this.genres.splice(id, 1);
    console.log(this.genres);
    this.updateDocument();
    //this.updateStorage();
  }

  public addTag(): void {
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
    console.log("tags:", this.tags);
    //this.updateStorage();
    this.updateDocument();
  }
  public deleteTag(id: number): void {
    // Delete at index
    this.tags.splice(id, 1);
    console.log(this.tags);
    //this.updateStorage();
    this.updateDocument();
  }



}
