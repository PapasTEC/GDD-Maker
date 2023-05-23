import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-document-not-found',
  templateUrl: './document-not-found.component.html',
  styleUrls: ['./document-not-found.component.scss']
})
export class DocumentNotFoundComponent {
  documentId: string;
  constructor(
    private route: ActivatedRoute,
    private router: Router) {
      this.route = route;
    }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (!params.pjt) {
        this.router.navigate(["/dashboard"]);
      }
      this.documentId = params.pjt;
    });
  }

  goToDashboard() {
    this.router.navigate(["/dashboard"]);
  }
}
