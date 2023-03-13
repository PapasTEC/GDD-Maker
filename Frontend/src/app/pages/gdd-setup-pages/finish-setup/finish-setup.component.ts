import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DocumentService } from '../../../services/document.service';

@Component({
  selector: 'app-finish-setup',
  templateUrl: './finish-setup.component.html',
  styleUrls: ['./finish-setup.component.scss', '../setupStyles.scss']
})
export class FinishSetupComponent {
  tempImage: string;

  constructor(private documentService: DocumentService, private router: Router) { }

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

  async finishSetup() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));

    const myPlatforms = currentSetup.gamePlatforms.map(platform => {
      return this.platforms[platform];
    });

    const myGameLogo = await this.convertTempUrlToBase64(currentSetup.gameLogo);
    const myCompanyLogo = await this.convertTempUrlToBase64(currentSetup.companyLogo);

    console.log("user: ", user);
    console.log("currentSetup: ", currentSetup);
    console.log("myPlatforms: ", myPlatforms);
    console.log("myGameLogo: ", myGameLogo);
    console.log("myCompanyLogo: ", myCompanyLogo);

    const document = {
      owner: user.email,
      frontPage: {
        documentTitle: currentSetup.gameTitle,
        documentLogo: myGameLogo,
        companyName: currentSetup.companyName,
        companyLogo: myCompanyLogo,
        collaborators: [user.name],
        lastUpdated: new Date()
      },
      documentContent: [{
        sectionTitle: "Basic Information",
        subSections: [{
          subSectionTitle: "Elevator Pitch",
          subSectionContent: {
            text: currentSetup.elevatorPitch
          }
        }, {
          subSectionTitle: "Tagline",
          subSectionContent: {}
        } , {
          subSectionTitle: "Genre",
          subSectionContent: {}
        }, {
          subSectionTitle: "Keywords and Tags",
          subSectionContent: {
            tags: currentSetup.gameTags
          }
        }]
      }, {
        sectionTitle: "Technical Information",
        subSections: [{
          subSectionTitle: "self",
          subSectionContent: {
            platforms: myPlatforms
          }
        }]
      }, {
        sectionTitle: "High Level Design",
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
      }]
    }

    console.log("document:", document);

    this.documentService.addDocument(document).subscribe(
      res => {
        console.log(res);
        alert("Document added successfully!");
        this.router.navigate(['/dashboard']);
      },
      err => {
        console.log(err);
        alert("Error adding document");
      }
    );
  }

  async convertTempUrlToBase64(url: any) {
    const base64 = await this.scaleAndEncodeImage(url);
    return base64;
  }

  async scaleAndEncodeImage(url: any): Promise<string> {
    const width = 256;
    const height = 256;
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(await fetch(url).then(r => r.blob()));
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const scaledBase64 = canvas.toDataURL();
        resolve(scaledBase64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64;
    });
  }
}
