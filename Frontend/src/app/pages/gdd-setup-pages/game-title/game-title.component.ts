import { Component, Input } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss', '../setupStyles.scss']
})

export class GameTitleComponent {

  currentTextInBox: string;
  routeUsingComponent: string;
  textBoxDefault: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(_value => this.routeUsingComponent = _value.type);
    this.textBoxDefault = this.setSubtitle(this.routeUsingComponent);
    if (sessionStorage.getItem('currentSetup') !== null) {
      this.getSessionStorageContent(this.routeUsingComponent);
    }
  }

  private setSubtitle(route: string): string {
    if (route === "game") {
      return "Please enter the name of your game.";
    } else if (route === "company") {
      return "Please enter the name of your company.";
    } else if (route === "core") {
      return "Please enter your core mechanic.";
    }
  }

  private getSessionStorageContent(route: string): void {
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    if (route === "game") {
      this.currentTextInBox = currentSetup.gameTitle;
    } else if (route === "company") {
      this.currentTextInBox = currentSetup.companyName;
    } else if (route === "core") {
      this.currentTextInBox = currentSetup.coreMechanic;
    }
  }

  private setSessionStorageContent(route: string): void {
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    if (route === "game") {
      currentSetup.gameTitle = this.currentTextInBox;
    } else if (route === "company") {
      currentSetup.companyName = this.currentTextInBox;
    } else if (route === "core") {
      currentSetup.coreMechanic = this.currentTextInBox;
    }
    sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }

  public onTextChange(text: string): void {
    this.currentTextInBox = text;
    if (sessionStorage.getItem('currentSetup') !== null) {
      this.setSessionStorageContent(this.routeUsingComponent);
    }
  }

}
