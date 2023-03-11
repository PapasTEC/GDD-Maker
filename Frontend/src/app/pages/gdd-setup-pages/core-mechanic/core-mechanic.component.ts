import { Component } from '@angular/core';

@Component({
  selector: 'app-core-mechanic',
  templateUrl: './core-mechanic.component.html',
  styleUrls: ['./core-mechanic.component.scss', '../setupStyles.scss']
})
export class CoreMechanicComponent {
  currentTextInBox: string;

  constructor() { }

  ngOnInit() {
    if (sessionStorage.getItem('currentSetup') !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
      this.currentTextInBox = currentSetup.coreMechanic;
    }
  }

  onTextChange(text: string) {
    this.currentTextInBox = text;
    
    let currentSetup = JSON.parse(sessionStorage.getItem('currentSetup'));
    currentSetup.coreMechanic = this.currentTextInBox;
    sessionStorage.setItem('currentSetup', JSON.stringify(currentSetup));
  }
}
