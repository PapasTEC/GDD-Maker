import { Component } from '@angular/core';

import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-core-mechanic',
  templateUrl: './core-mechanic.component.html',
  styleUrls: ['./core-mechanic.component.scss', '../setupStyles.scss']
})
export class CoreMechanicComponent {
  currentTextInBox: string;


  // Me lo llevo (No copie lo que hay entre los dos comentarios)

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
    let user = JSON.parse(sessionStorage.getItem('user'));
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));

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
              platforms: currentSetup.gamePlatforms
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
              aesthetic: currentSetup.aesthetic
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

    this.documentService.updateDocument(currentSetup._id, currentSetup).subscribe((data: any) => {
      console.log(data);
    });
  }

  // Me lo llevo

  ngOnInit() {
    if (sessionStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
      this.currentTextInBox = currentSetup.coreMechanic;
    }
  }

  onTextChange(text: string) {
    this.currentTextInBox = text;
    
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    currentSetup.coreMechanic = this.currentTextInBox;
    sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }
}
