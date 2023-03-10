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
  cardTitles = ["Game Title", "Game Logo", "Company Name", "Company Logo", "Game Tags", "Game Platforms", "Elevator Pitch", "Theme", "Aesthetic", "Core Mechanic"]

  routesIndex = 0;
  routesQuantity = this.routes.length;

  path = "";

  currentTitle = "";

  constructor(private router: Router, private route: ActivatedRoute) { 
    this.path = this.routes[this.routesIndex].path;
  }

  ngOnInit() {
    this.changePath();
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-background");
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

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");
  }
}
