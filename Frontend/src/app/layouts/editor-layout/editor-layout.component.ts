import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from "@angular/common";
import { DocumentService } from "src/app/services/document.service";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter } from 'rxjs/operators';

@Component({
  selector: "app-editor-layout",
  templateUrl: "./editor-layout.component.html",
  styleUrls: ["./editor-layout.component.scss"],
})
export class EditorLayoutComponent implements OnInit {
  sections = [];
  documentTitle = "";
  documentId = "";
  document: any;
  isDocumentEdited = false;

  autoSaveTimer: any;
  autoSaveIntervalInMinutes = 5;

  lastManualSaveTimer: any;
  lastManualSaveTimeInMinutes = 0;

  saveButtonText = "Save";
  currentTitle = "";

  constructor(private location: Location, private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private editingDocumentService: EditingDocumentService) { }

  openSidebar() {
    document.getElementById("sidebar").focus();
  }

  keepSidebarOpen() {
    document.getElementById("sidebar").focus();
  }

  toggleKeepSidebarOpen() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.classList.contains("sidebarHide")) {
      sidebar.classList.replace("sidebarHide", "sidebarShow");
      document.getElementById("pin").style.filter = " invert(26%) sepia(98%) saturate(1435%) hue-rotate(92deg) brightness(97%) contrast(107%)";
    } else if (sidebar.classList.contains("sidebarShow")) {
      sidebar.classList.replace("sidebarShow", "sidebarHide");
      document.getElementById("pin").style.filter = "";
    }
  }

  async changeButtonText() {
    this.saveButtonText = "Saved";
    setTimeout(() => {
      this.saveButtonText = "Save";
    }, 10 * 1000);
  }

  async updateLastManualSaveTime() {
    this.lastManualSaveTimer = setInterval(() => {
      this.lastManualSaveTimeInMinutes++;
    }, 60 * 1000); // Establecemos el intervalo para que se ejecute cada minuto
  }

  startAutoSaveTimer() {
    this.autoSaveTimer = setInterval(() => {
      console.log('Auto save..');
      if (this.isDocumentEdited) {
        if (this.saveDocument()) {
          this.isDocumentEdited = false;
        } else {
          alert("Error auto-updating document");
        }
      }
      this.startAutoSaveTimer();
    }, this.autoSaveIntervalInMinutes * 60 * 1000);
  }

  resetAutoSaveTimer() {
    clearInterval(this.autoSaveTimer);
    this.startAutoSaveTimer();
  }

  returnDashboard() {
    if (this.isDocumentEdited) {
      if (confirm("You have unsaved changes. Do you want to leave?")) {
        this.router.navigate(["/dashboard"]);
      }
    } else {
      this.router.navigate(["/dashboard"]);
    }
  }

  saveDocument(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.documentService.updateDocument(this.documentId, this.document).subscribe(
        res => {
          console.log("Update res: ", res);
          resolve(true);
          err => {
            console.log("Update err: ", err);
            reject(false);
          }
        });
    });
  }

  manualSave() {
    console.log('Manual save..');
    if (this.isDocumentEdited) {
      if (this.saveDocument()) {
        this.isDocumentEdited = false;
        this.lastManualSaveTimeInMinutes = 0;
        this.resetAutoSaveTimer();
        this.changeButtonText();
      } else {
        alert("Error updating document");
      }
    } else {
      this.lastManualSaveTimeInMinutes = 0;
      this.resetAutoSaveTimer();
      this.changeButtonText();
    }
  }

  setDocumentData() {
    this.documentService.getDocument(this.documentId).subscribe((data) => {
      console.log("data:", data);
      this.editingDocumentService.changeDocument(data);
      this.documentTitle = data['frontPage']['documentTitle'];
      this.document = data;
    });
  }

  switchSection(url: string) {
    switch (url) {
      case 'theme':
        this.currentTitle = "Theme";
        break;
      case 'aesthetics':
        this.currentTitle = "Aesthetics";
        break;
      case 'coreMechanic':
        this.currentTitle = "Core mechanic";
        break;
      default:
        this.currentTitle = "";
        break;
    }
  }

  getSectionRegex(section: string) {
    const regex = /\/editor\/(\w+)\?pjt=/;
    const match = section.match(regex);
    const result = match ? match[1] : null;
    return result;
  }

  ngOnInit() {

    this.route.queryParams.subscribe((params) => {
      this.documentId = params.pjt;
    });

    const section = this.getSectionRegex(this.location.path());
    if (section) {
      this.switchSection(section);
    }

    this.setDocumentData();

    this.updateLastManualSaveTime();
    this.startAutoSaveTimer();

    this.editingDocumentService.document$.pipe(
      filter(document => document !== null),
    ).subscribe((document) => {
      console.log("documentEditado");
      this.isDocumentEdited = true;
      this.document = document;
    });

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-background");

    document.getElementById("sidebar").focus();

    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        //this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }

    var links = document.getElementsByTagName("a");
    for (i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
        console.log(this.className);
        if (this.className == "nActive") {
          var otherLinks = document.getElementsByClassName("active");
          for (var j = 0; j < otherLinks.length; j++) {
            otherLinks[j].className = "nActive";
          }
          this.className = "active";
        }
      });
    }
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");

    clearInterval(this.autoSaveTimer);
    clearInterval(this.lastManualSaveTimer);
  }
}