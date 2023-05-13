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

  section: any;
  subSection: any;
  documentSubSection: any;
  techInfo = { platforms: [], ageClassification: "", targetAudience: "", releaseDate: "", price: ""};
  today: Date = new Date();

  constructor(private editingDocumentService: EditingDocumentService, private route: ActivatedRoute) {}

  getSectionAndSubSection(){
    this.route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
    
  }

  ngOnInit(){

    this.getSectionAndSubSection();

    // console.log("section: ", this.section);
    // console.log("subSection: ", this.subSection);

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
        this.techInfo = document.subSectionContent;

        
    });
  }

  updateDocument() {
    console.log("Tech Info: ", this.techInfo);
    this.documentSubSection.subSectionContent = this.techInfo;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  public addOrRemove(platformID: number) {
    if (this.techInfo.platforms.includes(platformID)) {
      this.techInfo.platforms.splice(
        this.techInfo.platforms.indexOf(platformID),
        1
      );
    } else {
      this.techInfo.platforms.push(platformID);
    }
    this.updateDocument();
  }

}
