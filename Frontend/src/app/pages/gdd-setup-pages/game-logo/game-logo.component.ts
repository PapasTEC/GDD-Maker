import { Component } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-logo',
  templateUrl: './game-logo.component.html',
  styleUrls: ['./game-logo.component.scss', '../setupStyles.scss']
})
export class GameLogoComponent {

  constructor(private route: ActivatedRoute) { }

  isCompanySetUp = false;	

  image?: HTMLImageElement;

  uploadedImage: string;
  
  logoUploadComponent:HTMLElement;

  ngOnInit() {
    this.route.data.subscribe(_value => this.isCompanySetUp = _value.type === "company" );
    this.logoUploadComponent = document.getElementById('logo');

    if (sessionStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
      if (this.isCompanySetUp) {
        this.uploadedImage = currentSetup.companyLogo;
      } else {
        this.uploadedImage = currentSetup.gameLogo;
      }
      
      if (this.uploadedImage != "") {
        this.updateLogo();
      }
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if(file){
      this.uploadedImage = URL.createObjectURL(file);
    
      this.updateLogo();

      if (sessionStorage.getItem('currentSetup') !== null) {
        let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
        if (this.isCompanySetUp) {
          currentSetup.companyLogo = this.uploadedImage;
        } else {
          currentSetup.gameLogo = this.uploadedImage;
        }
        sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
      }
    }
  }

  updateLogo() {
    let uploadButton = document.getElementById('upButton');
    uploadButton.style.backgroundImage = `url(${this.uploadedImage})`;
    uploadButton.style.backgroundSize = "100% 100%";
    uploadButton.style.backgroundRepeat = "no-repeat";

    //Get child element of upload button
    let uploadButtonChild = uploadButton.children[1] as HTMLElement;
    uploadButtonChild.style.display = 'none';
  }
}
