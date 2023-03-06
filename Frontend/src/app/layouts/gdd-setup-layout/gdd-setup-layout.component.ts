import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GddSetupLayoutRoutes } from './gdd-setup-layout.routing';

@Component({
  selector: 'app-gdd-setup-layout',
  templateUrl: './gdd-setup-layout.component.html',
  styleUrls: ['./gdd-setup-layout.component.scss']
})
export class GddSetupLayoutComponent {

  routes = GddSetupLayoutRoutes;
  cardTitles = ["Game Title", "Game Logo", "Company Name", "Company Logo", "Game Genre", "Game Platforms", "Elevator Pitch", "High Level Design"]

  routesIndex = 0;
  routesQuantity = this.routes.length;

  path = "";

  currentTitle = "";

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.path = this.routes[this.routesIndex].path;
  }

  ngOnInit() {
    this.changePath();
  }

  changePath(){
    this.router.navigate([this.path], {relativeTo: this.route});
    this.currentTitle = this.cardTitles[this.routesIndex];

  }

  previousPage(){
    
    if(this.routesIndex > 0){
      this.routesIndex--;
    }

    this.path = this.routes[this.routesIndex].path;
    this.changePath();
  }

  nextPage(){
  
    if(this.routesIndex < this.routesQuantity - 1){
      this.routesIndex++;
    }

    this.path = this.routes[this.routesIndex].path;
    this.changePath();
    
  }
}
