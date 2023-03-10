import { Component } from "@angular/core";
import {
  faSurprise,
  faHatWizard,
  faBook,
  faCrown,
  faPuzzlePiece,
  faUserFriends,
  faCompass,
  faPaintBrush,
  faDice,
} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-main-aesthetic",
  templateUrl: "./main-aesthetic.component.html",
  styleUrls: ["./main-aesthetic.component.scss", "../setupStyles.scss"],
})
export class MainAestheticComponent {
  sensationIcon = faSurprise;
  fantasyIcon = faHatWizard;
  narrativeIcon = faBook;
  challengeIcon = faCrown;
  puzzleIcon = faPuzzlePiece;
  fellowshipIcon = faUserFriends;
  discoveryIcon = faCompass;
  expressionIcon = faPaintBrush;
  submissionIcon = faDice;

  game_aesthetics = [
    {
      name: "Sensation",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.sensationIcon,
    },
    {
      name: "Fantasy",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.fantasyIcon,
    },
    {
      name: "Narrative",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.narrativeIcon,
    },
    {
      name: "Challenge",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.challengeIcon,
    },
    {
      name: "Puzzle",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.puzzleIcon,
    },
    {
      name: "Fellowship",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.fellowshipIcon,
    },
    {
      name: "Discovery",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.discoveryIcon,
    },
    {
      name: "Expression",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.expressionIcon,
    },
    {
      name: "Submission",
      img: "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png",
      icon: this.submissionIcon,
    },
  ];

  selected_aesthetics = [];
  multipleAllowed = false;

  constructor() {}

  addOrRemove(aesthetic: number) {
    let aestheticsIndicators = document.getElementsByClassName(
      "overlayImage"
    ) as HTMLCollectionOf<HTMLElement>;
    let currentAestheticIndicator = aestheticsIndicators[aesthetic];

    if (this.multipleAllowed) {
      if (this.selected_aesthetics.includes(aesthetic)) {
        this.selected_aesthetics.splice(
          this.selected_aesthetics.indexOf(aesthetic),
          1
        );
        currentAestheticIndicator.style.display = "none";
      } else {
        this.selected_aesthetics.push(aesthetic);
        currentAestheticIndicator.style.display = "block";
      }
    } else {
      if (!this.selected_aesthetics.includes(aesthetic)) {
        for (let i = 0; i < aestheticsIndicators.length; i++) {
          if (i != aesthetic) {
            aestheticsIndicators[i].style.display = "none";
          }
        }
        currentAestheticIndicator.style.display = "block";
        this.selected_aesthetics = [aesthetic];
      }
    }

    this.getDataInJSONFormat();
  }

  private getDataInJSONFormat(){
    let newJSON = {aesthetics:[]};
    this.selected_aesthetics.forEach(index => newJSON.aesthetics.push(this.game_aesthetics[index].name));
    console.log(newJSON);
    return newJSON;
  }
}
