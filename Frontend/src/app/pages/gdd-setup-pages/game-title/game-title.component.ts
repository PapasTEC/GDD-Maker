import { Component } from '@angular/core';
import { Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game-title',
  templateUrl: './game-title.component.html',
  styleUrls: ['./game-title.component.scss']
})
export class GameTitleComponent {

  constructor(private route: ActivatedRoute) { }

  isCompanySetUp = false;	
 
  ngOnInit() {
    this.route.data.subscribe(_value => this.isCompanySetUp = _value.type === "company" );
    
    console.log(this.isCompanySetUp)

  }

}
