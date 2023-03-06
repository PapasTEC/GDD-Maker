import { Component } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-logo',
  templateUrl: './game-logo.component.html',
  styleUrls: ['./game-logo.component.scss']
})
export class GameLogoComponent {
  constructor(private route: ActivatedRoute) { }

  isCompanySetUp = false;	
 
  ngOnInit() {
    this.route.data.subscribe(_value => this.isCompanySetUp = _value.type === "company" );
    
    console.log(this.isCompanySetUp)

  }
}
