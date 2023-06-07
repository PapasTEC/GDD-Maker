import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard-layout",
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: ["./dashboard-layout.component.scss"],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  test: Date = new Date();
  public isCollapsed = true;

  constructor(private router: Router) {}

  ngOnInit() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.add("dashboard-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-background");
    var footer = document.getElementsByTagName("footer")[0];
    footer.classList.add("bg-background");
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
  ngOnDestroy() {
    var html = document.getElementsByTagName("html")[0];
    html.classList.remove("dashboard-layout");
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");
    var footer = document.getElementsByTagName("footer")[0];
    footer.classList.remove("bg-background");
  }
}
