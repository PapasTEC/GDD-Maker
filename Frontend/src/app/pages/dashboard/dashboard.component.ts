import { Component, OnInit, QueryList, ViewChildren } from "@angular/core";
import {
  SortableHeaderDirective,
  SortEvent,
  compare,
} from "./sortable.header.directive";
import { Router } from "@angular/router";

import { DocumentService } from "../../services/document.service";
import { UserService } from "../../services/user.service";
import { TokenService } from "../../services/token.service";
import { CookieService } from "ngx-cookie-service";

import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

export interface Project {
  documentTitle: string;
  documentLogo: string;
  lastUpdated: string;
  owner: string;
  _id: string;
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private documentService: DocumentService,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  tableMode: string = "My Projects";
  Projects: Project[];
  data: Project[];
  tableFilter: String;

  MyProjectsData: Project[] = [];

  SharedProjectsData: Project[] = [];

  email: string;
  sharedProjects: any;

  ngOnInit() {
    this.tableMode = "My Projects";

    this.tokenService.decodeToken().subscribe((data: any) => {
      this.email = data.decoded.email;

      this.userService.getUser(this.email).subscribe((data: any) => {
        this.sharedProjects = data.shared_with_me_documents;
        this.documentService
          .getMyProjects(this.email)
          .subscribe((data: any) => {
            this.MyProjectsData = data.map((project: any) => {
              return {
                documentTitle: project.frontPage.documentTitle,
                documentLogo: project.frontPage.documentLogo,
                lastUpdated: new Date(
                  project.frontPage.lastUpdated
                ).toLocaleTimeString([], {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                owner: "",
                _id: project._id,
              };
            });

            this.documentService
              .getSharedProjects(this.sharedProjects)
              .subscribe((data: any) => {
                this.SharedProjectsData = data.map((project: any) => {
                  return {
                    documentTitle: project.frontPage.documentTitle,
                    documentLogo: project.frontPage.documentLogo,
                    lastUpdated: new Date(
                      project.frontPage.lastUpdated
                    ).toLocaleTimeString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }),
                    owner: project.owner,
                    _id: project._id,
                  };
                });

                this.Projects = this.MyProjectsData;
                this.data = this.Projects;
              });
          });
      });
    });
  }

  goToEditor(idProject: string) {
    this.router.navigate(["/editor"], { queryParams: { pjt: idProject } });
  }

  toggleTable() {
    if (this.tableMode == "My Projects") {
      this.tableMode = "Shared Projects";
      this.Projects = this.SharedProjectsData;
    } else if (this.tableMode == "Shared Projects") {
      this.tableMode = "My Projects";
      this.Projects = this.MyProjectsData;
    }
    this.data = this.Projects;
  }

  async deleteDocument(id: string) {
    let { isConfirmed } = await Swal.fire({
      title: "Are you sure you want to delete this document?",
      icon: "question",
      confirmButtonText: "Yes, delete it",
      showDenyButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (isConfirmed) {
      this.documentService.deleteDocument(id).subscribe((data1: any) => {
        this.Projects = this.Projects.filter(
          (project: Project) => project._id != id
        );
        this.MyProjectsData = this.MyProjectsData.filter(
          (project: Project) => project._id != id
        );
        this.data = this.Projects;
        this.userService
          .removeOwnProject(this.email, id)
          .subscribe((data2: any) => {
            this.documentService
              .deleteFolderImages(id)
              .subscribe((data3: any) => {});
          });
      });
    }
  }

  deleteSharedDocument(id: string) {
    this.documentService.removeUser(id, this.email).subscribe((data: any) => {
      let success = false;
      let message;
      if (data.users) {
        success = true;
        this.toastr.success("Left the document successfully!");
        this.SharedProjectsData = this.SharedProjectsData.filter(
          (project: Project) => project._id != id
        );
        if (this.tableMode == "Shared Projects") {
          this.Projects = this.SharedProjectsData;
          this.data = this.Projects;
        }
      } else {
        success = false;
        this.toastr.error("Couldn't leave the document!");
      }
    });
  }

  @ViewChildren(SortableHeaderDirective)
  headers: QueryList<SortableHeaderDirective>;

  onSort({ column, direction }: SortEvent) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    if (direction === "" || column === "") {
      this.Projects = this.data;
    } else {
      this.Projects = [...this.data].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === "asc" ? res : -res;
      });
    }
  }
}
