import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-elevator-pitch',
  templateUrl: './elevator-pitch.component.html',
  styleUrls: ['./elevator-pitch.component.scss', '../setupStyles.scss']
})
export class ElevatorPitchComponent {
  currentTextInBox: string;
  subtitle: string;
  routeUsingComponent: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(_value => this.routeUsingComponent = _value.type);
    this.subtitle = this.setSubtitle(this.routeUsingComponent);
    if (sessionStorage.getItem('currentSetup') !== null) {
      this.getSessionStorageContent(this.routeUsingComponent);
    }
  }

  onTextChange(text: string) {
    this.currentTextInBox = text;
    this.setSessionStorageContent(this.routeUsingComponent);
  }

  private setSubtitle(route: string): string {
    if (route === "elevator") {
      return "Please write down the elevator pitch of your game";
    } else if (route === "theme") {
      return "Please write down the theme of your game";
    } 
  }

  private getSessionStorageContent(route: string): void {
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    if(route === "elevator") {
      this.currentTextInBox = currentSetup.elevatorPitch;
    } else if (route === "theme") {
      this.currentTextInBox = currentSetup.theme;
    }
  }

  private setSessionStorageContent(route: string): void {
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    if (route === "elevator") {
      currentSetup.elevatorPitch = this.currentTextInBox;
    } else if (route === "theme") {
      currentSetup.theme = this.currentTextInBox;
    }
    sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }

}