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

  uploadedImage = new Image();
  
  logoUploadComponent:HTMLElement;
 
  ngOnInit() {
    this.route.data.subscribe(_value => this.isCompanySetUp = _value.type === "company" );
    this.logoUploadComponent = document.getElementById('logo');
    this.logoUploadComponent.addEventListener('change', this.handleFileSelect, false);
  }

  handleFileSelect = (evt: any) => {

    const files = evt.target.files; 
    const file = files[0];

    if(file){
      let newImage = URL.createObjectURL(file);
    
      let uploadButton = document.getElementById('upButton');
      uploadButton.style.backgroundImage = `url(${newImage})`;
      uploadButton.style.backgroundSize = "100% 100%";
      uploadButton.style.backgroundRepeat = "no-repeat";

      //Get child element of upload button
      let uploadButtonChild = uploadButton.children[1] as HTMLElement;
      uploadButtonChild.style.display = 'none';

      this.uploadedImage.src = newImage;
    }

    console.log(this.uploadedImage);
    
    
    
    }

  

  
}
