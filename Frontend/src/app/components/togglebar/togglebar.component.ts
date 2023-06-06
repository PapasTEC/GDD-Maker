import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

















@Component({
  selector: 'app-togglebar',
  templateUrl: './togglebar.component.html',
  styleUrls: ['./togglebar.component.scss']
})
export class TogglebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {

    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
   });
  }
}
