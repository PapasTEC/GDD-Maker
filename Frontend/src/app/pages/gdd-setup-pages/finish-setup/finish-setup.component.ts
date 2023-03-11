import { Component } from '@angular/core';

import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-finish-setup',
  templateUrl: './finish-setup.component.html',
  styleUrls: ['./finish-setup.component.scss', '../setupStyles.scss']
})
export class FinishSetupComponent {
  currentTextInBox: string;


  constructor(private documentService: DocumentService) { }

  platforms = [
    "Android",
    "iOS",
    "Web",
    "Linux",
    "MacOS",
    "Windows",
    "Playstation",
    "Xbox",
    "Nintendo Switch"
  ];

  aesthetics = [
    "Sensation",
    "Fantasy",
    "Narrative",
    "Challenge",
    "Puzzle",
    "Fellowship",
    "Exploration",
    "Discovery",
    "Expression",
    "Submission"
  ];

  finishSetup() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));

    const myPlatforms = currentSetup.gamePlatforms.map(platform => {
      return this.platforms[platform];
    });

    console.log("user: ", user);
    console.log("currentSetup: ", currentSetup);
    console.log("myPlatforms: ", myPlatforms);

    const document = {
      owner: user.email,
      frontPage: {
        documentTitle: currentSetup.gameTitle,
        documentLogo: currentSetup.gameLogo,
        companyName: currentSetup.companyName,
        companyLogo: currentSetup.companyLogo,
        collaborators: [user.name],
        lastUpdated: new Date()
      },
      documentContent: [{
        sectionTitle: "Basic Information",
        content: {
          selfContent: {},
          subSections: [{
            subSectionTitle: "Elevator Pitch",
            subSectionContent: {
              text: currentSetup.elevatorPitch
            }
          }, {
            subSectionTitle: "Tagline",
            subSectionContent: {},
          } , {
            subSectionTitle: "Genre",
            subSectionContent: {},
          }, {
            subSectionTitle: "Keywords and Tags",
            subSectionContent: {
              tags: currentSetup.gameTags
            },
          }]
        }
      }, {
        sectionTitle: "Technical Information",
        content: {
          selfContent: {},
          subSections: [{
            subSectionTitle: "Platforms",
            subSectionContent: {
              platforms: myPlatforms
            }
          }]
        }
      }, {
        sectionTitle: "High Level Design",
        content: {
          selfContent: {},
          subSections: [{
            subSectionTitle: "Theme",
            subSectionContent: {
              text: currentSetup.theme
            }
          }, {
            subSectionTitle: "Aesthetic",
            subSectionContent: {
              aesthetic: this.aesthetics[currentSetup.aesthetic[0]]
            }
          }, {
            subSectionTitle: "Core Mechanic",
            subSectionContent: {
              text: currentSetup.coreMechanic
            }
          }]
        }
      }]
    }

    console.log("document:", document);

    // this.documentService.updateDocument(currentSetup._id, currentSetup).subscribe((data: any) => {
    //   console.log(data);
    // });
  }

  // Me lo llevo

  ngOnInit() {
    if (sessionStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
      this.currentTextInBox = currentSetup.coreMechanic;
    }
  }
}
