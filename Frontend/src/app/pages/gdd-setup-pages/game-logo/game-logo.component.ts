import { Component } from "@angular/core";
import { Route, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-game-logo",
  templateUrl: "./game-logo.component.html",
  styleUrls: ["./game-logo.component.scss", "../setupStyles.scss"],
})
export class GameLogoComponent {
  constructor(private route: ActivatedRoute) { }

  uploadedImage: string;
  routeUsingComponent: string;
  subtitle: string;

  ngOnInit() {
    this.route.data.subscribe(
      (_value) => (this.routeUsingComponent = _value.type)
    );

    this.subtitle = this.setSubtitle(this.routeUsingComponent);

    if (sessionStorage.getItem("currentSetup") !== null) {
      this.getSessionStorageContent(this.routeUsingComponent);

      if (this.uploadedImage != "") {
        this.updateLogo(); 
      }
    }
  }

  private setSessionStorageContent(route: string): void {
    let currentSetup = JSON.parse(sessionStorage.getItem("currentSetup"));
    if (route === "game") {
      currentSetup.gameLogo = this.uploadedImage;
    } else if (route === "company") {
      currentSetup.companyLogo = this.uploadedImage;
    }
    sessionStorage.setItem("currentSetup", JSON.stringify(currentSetup));
  }

  private getSessionStorageContent(route: string): void {
    let currentSetup = JSON.parse(sessionStorage.getItem("currentSetup"));
    if (route === "game") {
      this.uploadedImage = currentSetup.gameLogo;
    } else if (route === "company") {
      this.uploadedImage = currentSetup.companyLogo;
    }
  }

  private setSubtitle(route: string): string {
    if (route === "game") {
      return "Upload your game logo here";
    } else if (route === "company") {
      return "Upload your company logo here";
    }
  }

  public onFileSelected(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.uploadedImage = URL.createObjectURL(file);

      this.updateLogo();

      if (sessionStorage.getItem("currentSetup") !== null) {
        this.setSessionStorageContent(this.routeUsingComponent);
      }
    }
  }

  private updateLogo(): void {
    let uploadButton = document.getElementById("upButton");
    uploadButton.style.backgroundImage = `url(${this.uploadedImage})`;
    uploadButton.style.backgroundSize = "100% 100%";
    uploadButton.style.backgroundRepeat = "no-repeat";

    //Get child element of upload button
    let uploadButtonChild = uploadButton.children[1] as HTMLElement;
    uploadButtonChild.style.display = "none";

    let img = new Image();
    img.src = this.uploadedImage;
    img.onload = () => {
      let aspectRatio = img.width / img.height;
      console.log("aspectRatio: ", aspectRatio);
      //uploadButtonChild.style.display = "none";

      const w = "calc(15vmax * " + (aspectRatio) + ")"
      const h = "15vmax";

        uploadButton.style.width = w;
        uploadButton.style.height = h;

        
      
    };
  }

  
}
