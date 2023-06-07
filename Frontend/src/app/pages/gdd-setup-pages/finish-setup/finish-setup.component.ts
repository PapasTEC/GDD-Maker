import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { DocumentService } from "../../../services/document.service";
import { UserService } from "src/app/services/user.service";
import { TokenService } from "src/app/services/token.service";
import { ToastrService } from "ngx-toastr";
@Component({
  selector: "app-finish-setup",
  templateUrl: "./finish-setup.component.html",
  styleUrls: ["./finish-setup.component.scss", "../setupStyles.scss"],
})
export class FinishSetupComponent {
  tempImage: string;
  status: string = "creating";
  documentId: string;
  constructor(
    private tokenService: TokenService,
    private documentService: DocumentService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  platforms = [
    "Android",
    "iOS",
    "Web",
    "Linux",
    "MacOS",
    "Windows",
    "Playstation",
    "Xbox",
    "Nintendo Switch",
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
    "Submission",
  ];
  generateCode() {
    const charset =
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    let length = 12;
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }
  hasNonAsciiCharacters(string) {
    const nonAsciiRegex = /[^\x00-\x7F]/;
    return nonAsciiRegex.test(string);
  }
  async saveImageInServer(file, fixName, documentId) {
    const formData = new FormData();
    formData.append("image", file, fixName);
    await new Promise((resolve, reject) => {
      this.documentService.uploadImage(documentId, fixName, formData).subscribe(
        (res) => {},
        (err) => {
          if (err.status === 200) {
            resolve(err);
          } else {
            reject(err);
          }
        }
      );
    });
    return;
  }
  base64ToFile(base64String, fileName) {
    const byteString = atob(base64String.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/png" });
    return new File([blob], fileName, { type: "image/png" });
  }
  genNewImageName() {
    let fixName: string;
    fixName = Date.now().toString();
    return fixName;
  }
  getNewImageName(fileName: string) {
    let fixName: string;
    if (this.hasNonAsciiCharacters(fileName)) {
      fixName = Date.now().toString() + "." + fileName.split(".")[1];
    } else {
      fixName = fileName.replace(/ /gi, "_");
    }
    return fixName;
  }
  async saveLogoToServer(sessionStLogoName, sessionStLogoURL, docID) {
    let newName = this.getNewImageName(sessionStLogoName);
    let newPath = `uploads/${docID}/${newName}`;
    let file = await this.urlToFile(
      sessionStLogoURL,
      newName,
      this.getMimeTypeFromFileName(newName)
    );
    await this.saveImageInServer(file, newName, docID);
    return newPath;
  }
  async finishSetup() {
    this.status = "saving";
    let user;
    this.tokenService.decodeToken().subscribe(async (data: any) => {
      user = data.decoded;
      user.image = localStorage.getItem("ImageUser");
      let currentSetup = JSON.parse(sessionStorage.getItem("currentSetup"));
      const myPlatforms = currentSetup.gamePlatforms.map((platform) => {
        return this.platforms[platform];
      });
      let myGameLogo =
        "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG";
      let myCompanyLogo =
        "https://www.freeiconspng.com/uploads/no-image-icon-11.PNG";
      console.log("currentSetup.gameTitle", currentSetup.gameTitle);
      console.log("currentSetup.companyName", currentSetup.companyName);
      console.log("currentSetup.aesthetic[0]", currentSetup.aesthetic[0]);
      if (currentSetup.gameTitle === "" || currentSetup.companyName === "" || currentSetup.aesthetic[0] === undefined) {
        this.status = "creating";
        this.toastr.error(
          "Error adding document. Make sure you have filled all the required fields",
          "",
          {
            timeOut: 30000,
            closeButton: true,
          }
        );
        return;
      }
      const document = {
        owner: user.email,
        invited: [],
        codeReadOnly: this.generateCode(),
        frontPage: {
          documentTitle: currentSetup.gameTitle,
          documentLogo: myGameLogo,
          companyName: currentSetup.companyName,
          companyLogo: myCompanyLogo,
          collaborators: [user.name],
          lastUpdated: new Date(),
        },
        documentContent: [
          {
            sectionTitle: "Basic Information",
            subSections: [
              {
                subSectionTitle: "Basic Information",
                subSectionContent: {
                  elevatorPitch: currentSetup.elevatorPitch,
                  tagline: "",
                  genres: [],
                  tags: currentSetup.gameTags,
                },
              },
            ],
          },
          {
            sectionTitle: "Technical Information",
            subSections: [
              {
                subSectionTitle: "Technical Information",
                subSectionContent: {
                  platforms: currentSetup.gamePlatforms,
                  ageClassification: "",
                  targetAudience: "",
                  releaseDate: "",
                  price: "",
                },
              },
            ],
          },
          {
            sectionTitle: "High Level Design",
            subSections: [
              {
                subSectionTitle: "Theme",
                subSectionContent: {
                  text: currentSetup.theme,
                },
              },
              {
                subSectionTitle: "Aesthetic",
                subSectionContent: {
                  aesthetics: [
                    {
                      name: this.aesthetics[currentSetup.aesthetic[0]],
                      content: "",
                    },
                  ],
                },
              },
              {
                subSectionTitle: "Core Mechanic",
                subSectionContent: {
                  coreMechanic: currentSetup.coreMechanic,
                  secondary: "",
                  progression: "",
                  metaphore: "",
                },
              },
            ],
          },
          {
            sectionTitle: "Low Level Design",
            subSections: [
              {
                subSectionTitle: "Detail of the Core Mechanic",
                subSectionContent: {
                  tokens: "",
                  resources: "",
                  additionalElements: "",
                  decisions: "",
                  intermediate: "",
                  local: "",
                  global: "",
                },
              },
              {
                subSectionTitle: "Detail of the Secondary Mechanic",
                subSectionContent: {
                  text: "",
                },
              },
              {
                subSectionTitle: "Core Gameplay Loop",
                subSectionContent: {
                  first: "",
                  second: "",
                  third: "",
                  fourth: "",
                },
              },
            ],
          },
          {
            sectionTitle: "Narrative and Worldbuilding",
            subSections: [
              {
                subSectionTitle: "Setting",
                subSectionContent: {
                  text: "",
                },
              },
              {
                subSectionTitle: "Characters",
                subSectionContent: {
                  characters: [],
                },
              },
              {
                subSectionTitle: "Events",
                subSectionContent: {
                  events: [],
                },
              },
            ],
          },
          {
            sectionTitle: "Look and Feel",
            subSections: [
              {
                subSectionTitle: "Visual Style",
                subSectionContent: {
                  text: "",
                },
              },
              {
                subSectionTitle: "User Interface",
                subSectionContent: {
                  text: "",
                },
              },
              {
                subSectionTitle: "Music and Sound",
                subSectionContent: {
                  text: "",
                },
              },
            ],
          },
          {
            sectionTitle: "Game References",
            subSections: [
              {
                subSectionTitle: "Game References",
                subSectionContent: {
                  text: "",
                },
              },
            ],
          },
        ],
      };
      this.documentService.addDocument(document).subscribe(
        async (res: any) => {
          if (res?.error) {
            this.status = "creating";
            this.toastr.error(
              "Error adding document. Make sure you have filled all the required fields",
              "",
              {
                timeOut: 30000,
                closeButton: true,
              }
            );
            return;
          }
          this.documentId = res["id"];
          this.userService
            .addOwnProject(user.email, res["id"])
            .subscribe(async (_) => {
              this.status = "success";
              if (currentSetup.gameLogo !== "") {
                myGameLogo = await this.saveLogoToServer(
                  currentSetup.gameLogoName,
                  currentSetup.gameLogo,
                  this.documentId
                );
              }
              if (currentSetup.companyLogo !== "") {
                myCompanyLogo = await this.saveLogoToServer(
                  currentSetup.companyLogoName,
                  currentSetup.companyLogo,
                  this.documentId
                );
              }
              document.frontPage.documentLogo = myGameLogo;
              document.frontPage.companyLogo = myCompanyLogo;
              this.documentService
                .updateDocument(this.documentId, document)
                .subscribe((res3) => {});
              setTimeout(() => {
                this.router.navigate(["/dashboard"]);
              }, 2000);
              (err2) => {
                this.status = "creating";
                this.toastr.error("Error adding document to user", "", {
                  timeOut: 10000,
                  closeButton: true,
                });
              };
            });
        },
        (err) => {
          this.status = "creating";
          this.toastr.error("Error adding document", "", {
            timeOut: 10000,
            closeButton: true,
          });
        }
      );
    });
  }
  async urlToFile(url, filename, mimeType) {
    return await fetch(url)
      .then((response) => response.blob())
      .then((blob) => new File([blob], filename, { type: mimeType }));
  }
  getMimeTypeFromFileName(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      default:
        return "";
    }
  }
  public async convertTempUrlToBase64(url: any) {
    const base64 = await this.scaleAndEncodeImage(url);
    return base64;
  }
  async scaleAndEncodeImage(url: any): Promise<string> {
    let width = 512;
    let height = width;
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(await fetch(url).then((r) => r.blob()));
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const aspect = img.width / img.height;
        if (img.width > img.height) {
          height = width / aspect;
        } else {
          width = height * aspect;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const scaledBase64 = canvas.toDataURL();
        resolve(scaledBase64);
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = base64;
    });
  }
}
