import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { DocumentService } from "src/app/services/document.service";
import { EditingDocumentService } from "src/app/services/editing-document.service";

@Component({
  selector: "app-editor-layout",
  templateUrl: "./editor-layout.component.html",
  styleUrls: ["./editor-layout.component.scss"],
})
export class EditorLayoutComponent implements OnInit {
  sections = [];
  documentTitle = "";
  documentId = "";

  constructor(private location: Location, private route: ActivatedRoute, private documentService: DocumentService, private editingDocumentService: EditingDocumentService) {
    this.sections = [
      { sectionName: "High level design", sectionId: "hld" },
      { sectionName: "Low level design", sectionId: "lld" },
      { sectionName: "Test plan", sectionId: "tp" },
      { sectionName: "Test cases", sectionId: "tc" },
      { sectionName: "Test results", sectionId: "tr" },
      { sectionName: "Test summary", sectionId: "ts" },
    ];
    this.documentTitle = "";
  }

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

  setDocumentData() {
    this.documentService.getDocument(this.documentId).subscribe((data) => {
      console.log("data:", data);
      this.editingDocumentService.changeDocument(data);
      this.documentTitle = data['frontPage']['documentTitle'];
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.documentId = params.pjt;
    });

    this.setDocumentData();

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

    // sleep 3 seconds
    // setTimeout(() => {
    //   let fullScreenButton = document.querySelector(
    //     "#vditor > div.vditor-toolbar > div:nth-child(28) > button"
    //   );
    //   if (fullScreenButton) {
    //     fullScreenButton.addEventListener("click", () => {
    //       alert("hola");
    //     });
    //   } else {
    //     console.log("fullScreenButton is null");
    //   }
    // }, 1000);

    // vditor handlers wait 500ms to the vditor is loaded
    // setTimeout(() => {
    //   let fullScreenButton = document.querySelector(
    //     "#vditor > div.vditor-toolbar > div:nth-child(28) > button"
    //   );
    //   let showSidebarButton = document.querySelector(
    //     ".share-export-buttons__hide-icon"
    //   );

    //   if (!fullScreenButton || !showSidebarButton) {
    //     console.log("fullScreenButton or showSidebarButton is null");
    //     return;
    //   }

    //   fullScreenButton.addEventListener("click", () => {
    //     console.log("fullScreenButton clicked");
    //     let showSidebarButtonIsShowed =
    //       !showSidebarButton.classList.contains("hide");
    //     console.log("showSidebarButtonIsShowed: ", showSidebarButtonIsShowed);
    //     if (showSidebarButtonIsShowed) {
    //       showSidebarButton.classList.add("hide");
    //     } else {
    //       showSidebarButton.classList.remove("hide");
    //     }
    //   });
    // }, 500);
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");
  }
}