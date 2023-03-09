import { Component } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss', '../setupStyles.scss']
})

export class GameTitleComponent {

  isCompanySetUp: boolean = false;
  textBoxDefault: string = "Please enter the name of your game."
  textBoxComponent: HTMLInputElement;
  currentTextInBox: string;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(_value => this.isCompanySetUp = _value.type === "company");

    console.log(this.isCompanySetUp)

    if (this.isCompanySetUp) {
      this.textBoxDefault = "Please enter the name of your company."
    }

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
