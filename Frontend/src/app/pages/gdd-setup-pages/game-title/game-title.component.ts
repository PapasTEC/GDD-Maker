import { Component, Input } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss', '../setupStyles.scss']
})

export class GameTitleComponent {
  currentTextInBox: string;
  isCompanySetUp: boolean = false;
  textBoxDefault: string = "Please enter the name of your game."

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(_value => this.isCompanySetUp = _value.type === "company");

    console.log("isCompanySetup:", this.isCompanySetUp)

    if (this.isCompanySetUp) {
      this.textBoxDefault = "Please enter the name of your company."
    }

    if (sessionStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
      if (this.isCompanySetUp) {
        this.currentTextInBox = currentSetup.companyName;
      } else {
        this.currentTextInBox = currentSetup.gameTitle;
      }
    }
  }

  onTextChange(text: string) {
    this.currentTextInBox = text;

    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    if (this.isCompanySetUp) {
      currentSetup.companyName = this.currentTextInBox;
    } else {
      currentSetup.gameTitle = this.currentTextInBox;
    }
    sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }

  private getDataInJSONFormat(): Object {
    let newJSON = { text: "" };
    newJSON.text = this.currentTextInBox;
    console.log(newJSON);
    return newJSON;
  }
}
