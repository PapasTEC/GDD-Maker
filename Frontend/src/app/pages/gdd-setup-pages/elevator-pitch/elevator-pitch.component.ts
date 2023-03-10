import { Component } from '@angular/core';

@Component({
  selector: 'app-elevator-pitch',
  templateUrl: './elevator-pitch.component.html',
  styleUrls: ['./elevator-pitch.component.scss', '../setupStyles.scss']
})
export class ElevatorPitchComponent {
  currentTextInBox: string;

  constructor() { }

  ngOnInit() {
    if (localStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(localStorage.getItem('currentSetup'));
      this.currentTextInBox = currentSetup.elevatorPitch;
    }
  }

  onTextChange(text: string) {
    this.currentTextInBox = text;
    
    let currentSetup = JSON.parse(localStorage.getItem('currentSetup'));
    currentSetup.elevatorPitch = this.currentTextInBox;
    localStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }

  private getDataInJSONFormat(): Object {
    let newJSON = { text: "" };
    newJSON.text = this.currentTextInBox;
    console.log(newJSON);
    return newJSON;
  }

}
