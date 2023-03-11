import { Component } from '@angular/core';

@Component({
  selector: 'app-high-level-design',
  templateUrl: './high-level-design.component.html',
  styleUrls: ['./high-level-design.component.scss', '../setupStyles.scss']
})
export class HighLevelDesignComponent {
  currentTextInBox: string;

  ngOnInit() {
    if (sessionStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
      this.currentTextInBox = currentSetup.theme;
    }
  }

  onTextChange(text: string) {
    this.currentTextInBox = text;

    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    currentSetup.theme = this.currentTextInBox;
    sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }

  private getDataInJSONFormat(): Object {
    let newJSON = { text: "" };
    newJSON.text = this.currentTextInBox;
    console.log(newJSON);
    return newJSON;
  }
  
}
