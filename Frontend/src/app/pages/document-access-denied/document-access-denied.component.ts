import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-document-access-denied',
  templateUrl: './document-access-denied.component.html',
  styleUrls: ['./document-access-denied.component.scss']
})
export class DocumentAccessDeniedComponent {
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

