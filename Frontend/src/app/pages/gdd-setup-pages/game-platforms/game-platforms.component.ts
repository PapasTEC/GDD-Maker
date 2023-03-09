import { Component } from '@angular/core';

@Component({
  selector: 'app-game-platforms',
  templateUrl: './game-platforms.component.html',
  styleUrls: ['./game-platforms.component.scss', '../setupStyles.scss']
})
export class GamePlatformsComponent {

  platforms = [
    {"name":"Playstation", "image":"../../assets/img/platformIcons/playstation.png"}, 
    {"name":"Xbox", "image":"../../assets/img/platformIcons/xbox.png"}, 
    {"name":"Windows", "image":"../../assets/img/platformIcons/windows.png"}, 
    {"name":"Nintendo Switch", "image":"../../assets/img/platformIcons/switch.png"},
    {"name":"Linux", "image":"../../assets/img/platformIcons/linux.png"},
    {"name":"MacOS", "image":"../../assets/img/platformIcons/mac.png"},
    {"name":"Android", "image":"../../assets/img/platformIcons/android.png"},
    {"name":"iOS", "image":"../../assets/img/platformIcons/ios.png"},
    {"name":"Web", "image":"../../assets/img/platformIcons/web.png"},];

  //create onginit function to get platforms from database
  chosenPlatforms = [];
  //create function to add platform to list
  
  public addOrRemove(platformID:number){
    console.log("Platform ID: " + platformID);
    if(this.chosenPlatforms.includes(platformID)){
      this.chosenPlatforms.splice(this.chosenPlatforms.indexOf(platformID), 1);
    }else{
      this.chosenPlatforms.push(platformID);
    }
    this.updatePlatformIndicator();
    this.getDataInJSONFormat();
  }

  updatePlatformIndicator(){
    var platformsInDocToActivate = document.getElementsByClassName("overlayImage");
    for(var i = 0; i < platformsInDocToActivate.length; i++){
      if(this.chosenPlatforms.includes(i)){
        platformsInDocToActivate[i].setAttribute("style", "display: block;");
      }else{
        platformsInDocToActivate[i].setAttribute("style", "display: none;");
      }
    
      }
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
