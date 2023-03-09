import { Component } from '@angular/core';

@Component({
  selector: 'app-elevator-pitch',
  templateUrl: './elevator-pitch.component.html',
  styleUrls: ['./elevator-pitch.component.scss', '../setupStyles.scss']
})
export class ElevatorPitchComponent {
  textBoxComponent: HTMLInputElement;
  currentTextInBox: string;

  ngOnInit() {
    this.textBoxComponent = document.getElementById('txtArea') as HTMLInputElement;
    this.textBoxComponent.addEventListener('input', this.handleTextChange, false);
  }

  public handleTextChange(evt: Event): void {
    this.currentTextInBox = (evt.target as HTMLInputElement).value;
    console.log(this.currentTextInBox)
  }

  private getDataInJSONFormat(): Object {
    let newJSON = { text: "" };
    newJSON.text = this.currentTextInBox;
    console.log(newJSON);
    return newJSON;
  }

}
