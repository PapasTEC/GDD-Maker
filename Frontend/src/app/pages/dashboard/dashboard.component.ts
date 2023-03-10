import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import {
  SortableHeaderDirective,
  SortEvent,
  compare,
} from './sortable.header.directive';

import { DocumentService } from '../../services/document.service';
import { UserService } from '../../services/user.service';

export interface Project {
  documentTitle: string;
  documentLogo: string;
  lastUpdated: string;
  owner: string;
  _id: string;
} 

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private documentService: DocumentService, private userService: UserService) {}

  tableMode: string = 'My Projects';
  Projects: Project[];
  data: Project[];
  tableFilter: String;

  MyProjectsData: Project[] = []
  
  SharedProjectsData: Project[] = []

  email: string;
  sharedProjects: any;

  ngOnInit() {
    this.tableMode = 'My Projects';

    this.email = JSON.parse(localStorage.getItem('currentUser')).email;

    this.userService.getUser(this.email).subscribe((data: any) => {
      this.sharedProjects = data.shared_with_me_documents;
      this.documentService.getMyProjects(this.email).subscribe((data: any) => {
        this.MyProjectsData = data.map((project: any) => {
          return {
            documentTitle: project.frontPage.documentTitle,
            documentLogo: project.frontPage.documentLogo,
            lastUpdated: new Date(project.frontPage.lastUpdated).toLocaleDateString('es-ES'),
            owner: "",
            _id: project._id
          }
        });
        this.Projects = this.MyProjectsData;
        this.data = this.Projects;
      });

      this.documentService.getSharedProjects(this.sharedProjects).subscribe((data: any) => {
        this.SharedProjectsData = data.map((project: any) => {
          return {
            documentTitle: project.frontPage.documentTitle,
            documentLogo: project.frontPage.documentLogo,
            lastUpdated: new Date(project.frontPage.lastUpdated).toLocaleDateString('es-ES'),
            owner: project.owner,
            _id: project._id
          }
        });
      });
    });
  }

  toggleTable() {
    if (this.tableMode == 'My Projects') {
      this.tableMode = 'Shared Projects';
      this.Projects = this.SharedProjectsData;
    } else if (this.tableMode == 'Shared Projects') {
      this.tableMode = 'My Projects';
      this.Projects = this.MyProjectsData;
    }
    this.data = this.Projects;
  }

  deleteDocument(id: string) {
    if (confirm("Are you sure you want to delete this document?")) {
      this.documentService.deleteDocument(id).subscribe((data: any) => {
        this.Projects = this.Projects.filter((project: Project) => project._id != id);
        this.MyProjectsData = this.MyProjectsData.filter((project: Project) => project._id != id);
        this.data = this.Projects;
      });
    }
  }

  deleteSharedDocument(id: string) {
    alert("delete Shared" + id);
  }

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting countries
    if (direction === '' || column === '') {
      this.Projects = this.data;
    } else {
      this.Projects = [...this.data].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }
}


// MyProjectsData: Project[] = [
//   {
//     name: "Argon 4",
//     lastUpdated: "2020-01-03",
//     owner: ""
//   },
//   {
//     name: "Argon 1",
//     lastUpdated: "2020-01-01",
//     owner: ""
//   },
//   {
//     name: "Argon 2",
//     lastUpdated: "2020-01-02",
//     owner: ""
//   },
//   {
//     name: "Argon 3",
//     lastUpdated: "2020-01-03",
//     owner: ""
//   },
// ]

// SharedProjectsData: Project[] = [
//   {
//     name: "Argon 4",
//     lastUpdated: "2020-01-04",
//     owner: "abiasdsasdelpg1@gmail.com"
//   },
//   {
//     name: "Argon 5",
//     lastUpdated: "2020-01-05",
//     owner: "abiasdsasdelpg2@gmail.com"
//   },
//   {
//     name: "Argon 6",
//     lastUpdated: "2020-01-06",
//     owner: "abiasdsasdelpg3@gmail.com"
//   }
// ]

