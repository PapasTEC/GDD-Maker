import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map, take } from 'rxjs';
import { EditingDocumentService } from 'src/app/services/editing-document.service';

@Component({
  selector: 'app-technical-info',
  templateUrl: './technical-info.component.html',
  styleUrls: ['./technical-info.component.scss',"../editorGlobalStyles.scss",]
})
export class TechnicalInfoComponent {

  platforms = [
    { "name": "Android", "image": "../../assets/img/platformIcons/android.png" },
    { "name": "iOS", "image": "../../assets/img/platformIcons/ios.png" },
    { "name": "Web", "image": "../../assets/img/platformIcons/web.png" },
    { "name": "Linux", "image": "../../assets/img/platformIcons/linux.png" },
    { "name": "MacOS", "image": "../../assets/img/platformIcons/mac.png" },
    { "name": "Windows", "image": "../../assets/img/platformIcons/windows.png" },
    { "name": "Playstation", "image": "../../assets/img/platformIcons/playstation.png" },
    { "name": "Xbox", "image": "../../assets/img/platformIcons/xbox.png" },
    { "name": "Nintendo Switch", "image": "../../assets/img/platformIcons/switch.png" },
  ];

  chosenPlatforms = [];
  ageClassification = "";
  targetAudience = "";
  releaseDate = "";
  price = "";


  section: any;
  subSection: any;
  documentSubSection: any;
  techInfo = { platforms: [], ageClassification: "", targetAudience: "", releaseDate: "", price: ""};

  constructor(private editingDocumentService: EditingDocumentService, private route: ActivatedRoute) {}

  getSectionAndSubSection(){
    this.route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
    
  }

  ngOnInit(){

    this.getSectionAndSubSection();

    console.log("section: ", this.section);
    console.log("subSection: ", this.subSection);

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
        console.log("Document: ", document);
        this.documentSubSection = document;
        this.chosenPlatforms = document.subSectionContent.platforms;
        this.ageClassification = document.subSectionContent.ageClassification;
        this.targetAudience = document.subSectionContent.targetAudience;
        this.releaseDate = document.subSectionContent.releaseDate;
        this.price = document.subSectionContent.price;
        
    });
  }

  updateDocument() {
    this.techInfo.platforms = this.chosenPlatforms;
    this.techInfo.ageClassification = this.ageClassification;
    this.techInfo.targetAudience = this.targetAudience;
    this.techInfo.releaseDate = this.releaseDate;
    this.techInfo.price = this.price;
    console.log("Tech Info: ", this.techInfo);
    this.documentSubSection.subSectionContent = this.techInfo;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  public addOrRemove(platformID: number) {
    if (this.chosenPlatforms.includes(platformID)) {
      this.chosenPlatforms.splice(
        this.chosenPlatforms.indexOf(platformID),
        1
      );
    } else {
      this.chosenPlatforms.push(platformID);
    }

    console.log(this.chosenPlatforms);
    this.updateDocument();
  }

}
