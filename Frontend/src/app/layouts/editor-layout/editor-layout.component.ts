import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { ActivatedRoute, Router, Routes } from "@angular/router";
import { Location } from "@angular/common";
import { DocumentService } from "src/app/services/document.service";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter } from "rxjs/operators";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { layout } from "./docLayoutInterface";
import { EditorLayoutRoutes } from "./editor-layout.routing";

interface SectionSubsectionPath {
  section: string;
  subSection: string;
  path: string;
}

@Component({
  selector: "app-editor-layout",
  templateUrl: "./editor-layout.component.html",
  styleUrls: ["./editor-layout.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class EditorLayoutComponent implements OnInit {
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

  pinIcon = faThumbTack;

  // documentLayout:layout[];

  sectionsSubSectionsPath: SectionSubsectionPath[] = EditorLayoutRoutes.map(
    (route) => {
      return {
        section: route.data.section,
        subSection: route.data.subSection,
        path: route.path,
      };
    }
  );

  uniqueSections: Set<String> = new Set(
    this.sectionsSubSectionsPath.map((route) => route.section)
  );
  documentLayout = [...this.uniqueSections].map((section) => {
    return { section: section, subSections: [], paths: [] };
  });

  fillLayout = this.sectionsSubSectionsPath.forEach((route) => {
    let currentSection = route.section;
    let curretnSubSection = route.subSection;
    let currentPath = route.path;

    let oldSection = this.documentLayout.find(
      (section) => section.section === currentSection
    );
    let index = this.documentLayout.indexOf(oldSection);
    if (currentSection !== curretnSubSection)
      oldSection.subSections.push(curretnSubSection);

    oldSection.paths.push(currentPath);
    this.documentLayout[index] = oldSection;
  });

  a = [
    /*{section: "High Level Design", subSections: ["Theme", "Aesthetics", "Core Mechanic"]}, {section: "Narrative and Worldbuilding", subSections: ["Characters"]}*/
  ];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private editingDocumentService: EditingDocumentService,
    private cdRef: ChangeDetectorRef
  ) {
    console.log("sectionsSubSectionsPath: ", this.sectionsSubSectionsPath);

    console.log("uniqueSections: ", this.uniqueSections);
    console.log("layout: ", this.documentLayout);
  }

  @HostListener("window:keydown.alt.o", ["$event"])
  openSidebar() {
    document.getElementById("sidebar").focus();
  }

  @HostListener("window:keydown.alt.c", ["$event"])
  closeSidebar() {
    // this.toggleKeepSidebarOpen();
    if (document.getElementById("pin").classList.contains("pinned")) {
      this.toggleKeepSidebarOpen();
    }
    document.getElementById("sidebar").blur();
  }

  keepSidebarOpen() {
    document.getElementById("sidebar").focus();
  }

  pinnedSidebarColor: string = "#007bff";
  unpinnedSidebarColor: string = "#6c757d";

  @HostListener("window:keydown.alt.k", ["$event"])
  toggleKeepSidebarOpen() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.classList.contains("sidebarHide")) {
      sidebar.classList.replace("sidebarHide", "sidebarShow");
      document.getElementById("pin").classList.remove("unpinned");
      document.getElementById("pin").classList.add("pinned");
    } else if (sidebar.classList.contains("sidebarShow")) {
      sidebar.classList.replace("sidebarShow", "sidebarHide");
      document.getElementById("pin").classList.remove("pinned");
      document.getElementById("pin").classList.add("unpinned");
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
      console.log("Auto save..");
      if (this.isDocumentEdited) {
        if (this.saveDocument()) {
          this.isDocumentEdited = false;
        } else {
          alert("Error auto-updating document");
        }
      }
      // this.startAutoSaveTimer();
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
      this.document.frontPage.lastUpdated = new Date();
      this.documentService
        .updateDocument(this.documentId, this.document)
        .subscribe((res) => {
          console.log("Update res: ", res);
          resolve(true);
          (err) => {
            console.log("Update err: ", err);
            reject(false);
          };
        });
    });
  }

  manualSave() {
    console.log("Manual save..");
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
      this.documentTitle = data["frontPage"]["documentTitle"];
      this.document = data;
    });
  }

  switchSection(sectionTitle: string = null) {
    if (!sectionTitle) {
      const url = this.getSectionRegex(this.location.path());
      let routesChildren: any;
      routesChildren = this.route.routeConfig.children[0];
      routesChildren = routesChildren._loadedRoutes;
      for (const route of routesChildren) {
        if (route.path === url) {
          sectionTitle = route.data.subSection;
          break;
        }
      }
    }

    this.currentTitle = sectionTitle;
  }

  getSectionRegex(section: string) {
    const regex = /\/editor\/(\w+)\?pjt=/;
    const match = section.match(regex);
    const result = match ? match[1] : null;
    return result;
  }

  @HostListener("window:keydown.control.s", ["$event"])
  saveDocumentShortcut(event: KeyboardEvent) {
    event.preventDefault();
    this.manualSave();
    // TODO: Show a message that the document has been saved
  }

  changeSection(
    currentSubsection: SectionSubsectionPath,
    previousSubsection: SectionSubsectionPath,
    currentContentIndex: number,
    toContentIndex: number
  ) {
    // change color of the focused section/subsection
    var links = document.getElementsByTagName("a");

    for (let i = 0; i < links.length; i++) {
      // look for the section that was active
      if (links[i].className == "active") {
        // change the class of the section that was active
        links[i].className = "nActive";
      }
      if (i == toContentIndex) {
        // change the class of the section that is now active
        links[i].className = "active";
      }
    }

    if (currentSubsection.section === previousSubsection.section) {
      return;
    }

    // if last condition was not met, change the section

    // close the current section and open the previous section

    var dropdown = document.getElementsByClassName("dropdown-btn");

    for (let i = 0; i < dropdown.length; i++) {
      const thisSectionTitle = dropdown[i].textContent;
      console.log(thisSectionTitle + ", " + currentSubsection.section);
      if (thisSectionTitle === currentSubsection.section) {
        console.log("SECTION FOUND");
        dropdown[i].classList.toggle("active");
        var dropdownContent = dropdown[i].nextElementSibling as HTMLElement;
        dropdownContent.style.display = "none";
      }

      // open the previous section
      if (thisSectionTitle === previousSubsection.section) {
        console.log("SECTION FOUND");
        dropdown[i].classList.toggle("active");
        var dropdownContent = dropdown[i].nextElementSibling as HTMLElement;
        dropdownContent.style.display = "block";
      }
    }
  }

  // alt + up arrow
  @HostListener("window:keydown.alt.arrowup", ["$event"])
  moveSubsectionUp(event: KeyboardEvent) {
    event.preventDefault();

    let currentContentIndex = this.sectionsSubSectionsPath.findIndex(
      (section) => section.subSection === this.currentTitle
    );

    if (!currentContentIndex) {
      currentContentIndex = 1;
    }

    if (currentContentIndex > 0) {
      let currentSubsection = this.sectionsSubSectionsPath[currentContentIndex];
      let previousSubsection =
        this.sectionsSubSectionsPath[currentContentIndex - 1];

      this.switchSection(previousSubsection.subSection);
      this.router.navigate(["/editor/" + previousSubsection.path]);

      this.changeSection(
        currentSubsection,
        previousSubsection,
        currentContentIndex,
        currentContentIndex - 1
      );
    }
  }

  //   }
  // }

  // alt + down arrow
  @HostListener("window:keydown.alt.arrowdown", ["$event"])
  moveSubsectionDown(event: KeyboardEvent) {
    event.preventDefault();

    let currentContentIndex = this.sectionsSubSectionsPath.findIndex(
      (section) => section.subSection === this.currentTitle
    );
    if (!currentContentIndex) {
      currentContentIndex = 0;
    }

    if (currentContentIndex < this.sectionsSubSectionsPath.length - 1) {
      let currentSubsection = this.sectionsSubSectionsPath[currentContentIndex];
      let nextSubsection =
        this.sectionsSubSectionsPath[currentContentIndex + 1];

      this.switchSection(nextSubsection.subSection);
      this.router.navigate(["/editor/" + nextSubsection.path]);

      this.changeSection(
        currentSubsection,
        nextSubsection,
        currentContentIndex,
        currentContentIndex + 1
      );
    }
  }

  // alt + Esc to go to the dashboard
  @HostListener("window:keydown.alt.d", ["$event"])
  goToDashboard(event: KeyboardEvent) {
    event.preventDefault();
    this.returnDashboard();
  }

  ngOnInit() {
    this.switchSection();

    this.route.queryParams.subscribe((params) => {
      this.documentId = params.pjt;
    });

    this.setDocumentData();

    this.updateLastManualSaveTime();
    this.startAutoSaveTimer();

    this.editingDocumentService.document$
      .pipe(filter((document) => document !== null))
      .subscribe((document) => {
        console.log("documentEditado");
        this.isDocumentEdited = true;
        this.document = document;
      });

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-background");

    document.getElementById("sidebar").focus();
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();

    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        //this.classList.toggle("active");

        var otherDropdowns = document.getElementsByClassName("dropdown-btn");
        for (var j = 0; j < otherDropdowns.length; j++) {
          if (otherDropdowns[j] != this) {
            var sibling = otherDropdowns[j].nextElementSibling as HTMLElement;
            sibling.style.display = "none";
          }
        }
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
