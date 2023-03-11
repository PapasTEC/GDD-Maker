import { Component } from '@angular/core';

@Component({
  selector: 'app-game-platforms',
  templateUrl: './game-platforms.component.html',
  styleUrls: ['./game-platforms.component.scss', '../setupStyles.scss']
})
export class GamePlatformsComponent {

  platforms = [
    {"name":"Android", "image":"../../assets/img/platformIcons/android.png"},
    {"name":"iOS", "image":"../../assets/img/platformIcons/ios.png"},
    {"name":"Web", "image":"../../assets/img/platformIcons/web.png"},
    {"name":"Linux", "image":"../../assets/img/platformIcons/linux.png"},
    {"name":"MacOS", "image":"../../assets/img/platformIcons/mac.png"},
    {"name":"Windows", "image":"../../assets/img/platformIcons/windows.png"},
    {"name":"Playstation", "image":"../../assets/img/platformIcons/playstation.png"}, 
    {"name":"Xbox", "image":"../../assets/img/platformIcons/xbox.png"}, 
    {"name":"Nintendo Switch", "image":"../../assets/img/platformIcons/switch.png"},
  ];

  //create onginit function to get platforms from database
  chosenPlatforms = [];
  multipleAllowed = true;
  //create function to add platform to list
  
  public addOrRemove(platformID:number){

    let aestheticsIndicators = document.getElementsByClassName(
      "overlayImage"
    ) as HTMLCollectionOf<HTMLElement>;
    let currentAestheticIndicator = aestheticsIndicators[platformID];

    if (this.multipleAllowed) {
      if (this.chosenPlatforms.includes(platformID)) {
        this.chosenPlatforms.splice(
          this.chosenPlatforms.indexOf(platformID),
          1
        );
        currentAestheticIndicator.style.display = "none";
      } else {
        this.chosenPlatforms.push(platformID);
        currentAestheticIndicator.style.display = "block";
      }
    } else {
      if (!this.chosenPlatforms.includes(platformID)) {
        for (let i = 0; i < aestheticsIndicators.length; i++) {
          if (i != platformID) {
            aestheticsIndicators[i].style.display = "none";
          }
        }
        currentAestheticIndicator.style.display = "block";
        this.chosenPlatforms = [platformID];
      }
    }

    console.log(this.chosenPlatforms);
    this.getDataInJSONFormat();
  }

  

  
  ngOnInit(){
    
  }

  private getDataInJSONFormat(){
    let newJSON = {platforms:[]};
    this.chosenPlatforms.forEach(index => newJSON.platforms.push(this.platforms[index].name));
    console.log(newJSON);
    return newJSON;
  }

}
