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
import { TokenService } from "src/app/services/token.service";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import { filter, findIndex, timeout } from "rxjs/operators";
import { io } from "socket.io-client";
import { apiSocket } from "src/environments/environment";

import { EditorLayoutRoutes } from "./editor-layout.routing";
import { ToastrService } from "ngx-toastr";

import Swal from "sweetalert2";
import { read } from "@popperjs/core";

interface SectionSubsectionPath {
  section: string;
  subSection: string;
  path: string;
}

@Component({
  selector: "app-editor-layout",
  templateUrl: "./editor-layout.component.html",
  styleUrls: ["./editor-layout.component.scss"],
})
export class EditorLayoutComponent implements OnInit {
  documentTitle = "";
  documentId = "";
  document: any = null;
  isDocumentEdited = false;

  queryParams = {};

  autoSaveTimer: any;
  autoSaveIntervalInMinutes = 5;

  lastManualSaveTimer: any;
  lastManualSaveTimeInMinutes = 0;

  saveButtonText = "Save";
  currentTitle = "";

  pinIcon = faThumbTack;
  pinned = false;

  workspace: HTMLElement;
  hideSideBarButton: HTMLElement;

  firstChange = true;

  onlineUsers: any[] = [];

  isReadOnly = false;
  notAuthUser = false;

  documentCodeRead: string = "";

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
  showShareDocument: boolean = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private editingDocumentService: EditingDocumentService,
    private cdRef: ChangeDetectorRef,
    private tokenService: TokenService,
    private toastr: ToastrService
  ) {
    this.route = route;

    this.editingDocumentService.connectSocket();
  }

  @HostListener("window:keydown.alt.o", ["$event"])
  openSidebar() {
    if (this.workspace.classList.contains("sidebarHide")) {
      this.workspace.classList.replace("sidebarHide", "sidebarShow");
      this.hideSideBarButton.classList.add("flipHorizontal");
    } else if (this.workspace.classList.contains("sidebarShow")) {
      this.workspace.classList.replace("sidebarShow", "sidebarHide");
      this.hideSideBarButton.classList.remove("flipHorizontal");
      if (this.pinned) {
        this.toggleKeepSidebarOpen();
      }
    }
  }

  keepSidebarClosed() {
    if (!this.pinned) {
      this.workspace.classList.replace("sidebarShow", "sidebarHide");
      this.hideSideBarButton.classList.remove("flipHorizontal");
    }
  }

  @HostListener("window:keydown.alt.c", ["$event"])
  closeSidebar() {
    if (document.getElementById("pin").classList.contains("pinned")) {
      this.toggleKeepSidebarOpen();
    }
    document.getElementById("sidebar").blur();
  }

  keepSidebarOpen() {
    this.workspace.classList.replace("sidebarHide", "sidebarShow");
    this.hideSideBarButton.classList.add("flipHorizontal");
  }

  pinnedSidebarColor: string = "#007bff";
  unpinnedSidebarColor: string = "#6c757d";

  @HostListener("window:keydown.alt.k", ["$event"])
  toggleKeepSidebarOpenShortcut() {
    if (this.workspace.classList.contains("sidebarHide")) {
      return;
    }
    this.toggleKeepSidebarOpen();
  }

  toggleKeepSidebarOpen() {
    if (this.pinned) {
      document.getElementById("pin").classList.remove("pinned");
      document.getElementById("pin").classList.add("unpinned");
      this.pinned = false;
    } else {
      document.getElementById("pin").classList.remove("unpinned");
      document.getElementById("pin").classList.add("pinned");
      this.pinned = true;
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
      if (this.isDocumentEdited) {
        if (this.saveDocument()) {
          this.isDocumentEdited = false;
        } else {
          this.toastr.error("Error auto-updating document");
        }
      }
    }, this.autoSaveIntervalInMinutes * 60 * 1000);
  }

  resetAutoSaveTimer() {
    clearInterval(this.autoSaveTimer);
    this.startAutoSaveTimer();
  }

  async returnDashboard() {
    if (this.isDocumentEdited) {
      const { isConfirmed } = await Swal.fire({
        title: "You have unsaved changes.",
        text: "Do you want to leave?",
        icon: "warning",
        showDenyButton: true,
        confirmButtonText: `Yes`,
        allowOutsideClick: false,
        allowEscapeKey: false,
      });
      if (isConfirmed) {
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
          resolve(true);
          (err) => {
            reject(false);
          };
        });
    });
  }

  manualSave() {
    if (this.isDocumentEdited) {
      if (this.saveDocument()) {
        this.isDocumentEdited = false;
        this.lastManualSaveTimeInMinutes = 0;
        this.resetAutoSaveTimer();
        this.changeButtonText();
      } else {
        this.toastr.error("Error updating document");
      }
    } else {
      this.lastManualSaveTimeInMinutes = 0;
      this.resetAutoSaveTimer();
      this.changeButtonText();
    }
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
    if (!this.editingDocumentService.read_only) {
      event.preventDefault();
      this.manualSave();
      this.toastr.success("Document saved!", "", {
        timeOut: 500,
      });
    }
  }

  changeSection(
    currentSubsection: SectionSubsectionPath,
    newSection: SectionSubsectionPath,
    currentContentIndex: number,
    toContentIndex: number
  ) {
    var links = document.getElementsByTagName("a");

    for (let i = 0; i < links.length; i++) {
      if (links[i].className == "active") {
        links[i].className = "nActive";
      }
      if (i == toContentIndex) {
        links[i].className = "active";
      }
    }

    if (currentSubsection.section === newSection.section) {
      return;
    }

    var dropdown = document.getElementsByClassName("dropdown-btn");

    for (let i = 0; i < dropdown.length; i++) {
      const thisSectionTitle = dropdown[i].textContent;

      if (thisSectionTitle === currentSubsection.section) {
        dropdown[i].classList.toggle("active");
        var dropdownContent = dropdown[i].nextElementSibling as HTMLElement;

        dropdownContent.classList.remove("showDropdown");
        dropdownContent.classList.add("hideDropdown");

        dropdownContent.style.height = "0px";
        dropdownContent.style.display = "none";
      }

      if (thisSectionTitle === newSection.section) {
        dropdown[i].classList.toggle("active");
        var dropdownContent = dropdown[i].nextElementSibling as HTMLElement;

        dropdownContent.classList.remove("hideDropdown");
        dropdownContent.classList.add("showDropdown");

        dropdownContent.style.height = "fit-content";
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
      this.router.navigate(["/editor/" + previousSubsection.path], {
        queryParams: this.queryParams,
      });

      this.changeSection(
        currentSubsection,
        previousSubsection,
        currentContentIndex,
        currentContentIndex - 1
      );
    }
  }

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
      this.router.navigate(["/editor/" + nextSubsection.path], {
        queryParams: this.queryParams,
      });

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
    if (!this.editingDocumentService.read_only) {
      event.preventDefault();
      this.returnDashboard();
    }
  }

  setDocumentData() {
    this.documentService.getDocument(this.documentId).subscribe((data) => {
      const document = data;
      this.route.queryParams.subscribe((params) => {
        if (params.readOnly && params.readOnly !== document.codeReadOnly) {
          this.router.navigate(["/accessDenied"], {
            queryParams: params,
          });
        }
      });

      document.socketSubSection = "";

      this.documentCodeRead = document["codeReadOnly"];

      this.editingDocumentService.changeDocument(document);
      this.documentTitle = document["frontPage"]["documentTitle"];
      this.document = document;
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (!params.pjt) {
        this.router.navigate(["/dashboard"]);
      }
      this.documentId = params.pjt;
      if (params.readOnly) {
        this.isReadOnly = true;

        this.editingDocumentService.setReadOnly(params.readOnly);
        this.queryParams = {
          pjt: this.documentId,
          readOnly: this.editingDocumentService.read_only,
        };
      } else {
        this.isReadOnly = false;
        this.queryParams = { pjt: this.documentId };
      }

      this.setDocumentData();
      this.tokenService.decodeToken().subscribe((data: any) => {
        let localUser = data.decoded;
        this.notAuthUser = localUser.email === "";

        localStorage.setItem("readOnly", this.isReadOnly.toString());

        this.documentService
          .getUsers(this.documentId)
          .subscribe((documentUsers) => {
            if (documentUsers.error) {
              this.router.navigate(["/notFound"], {
                queryParams: this.queryParams,
              });
              return;
            }

            if (!params.readOnly) {
              if (
                documentUsers.owner.email !== localUser.email &&
                documentUsers.invited.findIndex(
                  (user) => user.email === localUser.email
                ) == -1
              ) {
                this.router.navigate(["/accessDenied"], {
                  queryParams: this.queryParams,
                });
                return;
              }
            }

            localUser.image = localStorage.getItem("ImageUser");

            this.editingDocumentService.setUserData(localUser, this.documentId);

            this.editingDocumentService.joinDocument();
            console.log(
              "************************** FINAL1 **************************"
            );

            this.updateLastManualSaveTime();
            this.startAutoSaveTimer();

            this.editingDocumentService.document$
              .pipe(filter((document) => document !== null))
              .subscribe((document) => {
                if (this.firstChange) {
                  this.firstChange = false;
                } else {
                  this.isDocumentEdited = true;
                  this.document = document;
                }
              });

            this.editingDocumentService.onlineUsers$.subscribe(
              (onlineUsers) => {
                this.onlineUsers = onlineUsers;
                console.log(
                  "----------------- Updated online users -----------------"
                );
              }
            );

            var body = document.getElementsByTagName("body")[0];
            body.classList.add("bg-background");

            console.log(
              "************************** FINAL3 **************************"
            );
          });
      });
    });
  }

  navToStartingSection() {
    this.switchSection("Document Cover");
    let coverLink = document.getElementsByClassName(
      "nActive"
    )[0] as HTMLElement;
    coverLink.classList.remove("nActive");
    coverLink.classList.add("active");

    this.router.navigate(["./cover"], {
      relativeTo: this.route,
      queryParams: this.queryParams,
    });
  }

  ngAfterViewInit() {
    this.navToStartingSection();

    this.cdRef.detectChanges();

    this.workspace = document.getElementById("workspace");
    this.hideSideBarButton = document.getElementById("showHideSBButton");

    this.workspace.addEventListener("click", (ev) => {
      const targ = ev.target as HTMLElement;
      if (!targ.classList.contains("open-sidebar-button")) {
        this.keepSidebarClosed();
      }
    });

    var dropdown = document.getElementsByClassName("dropdown-btn");
    var singleSection = document.getElementsByTagName("a");
    let singleSections = Array.from(singleSection).filter((el) => {
      return el.id === "singleSec";
    });

    var i;
    for (i = 0; i < dropdown.length; i++) {
      this.add(dropdown[i], true);
    }

    for (i = 0; i < singleSection.length; i++) {
      if (singleSection[i].id === "singleSec")
        this.add(singleSection[i], false);
    }

    var links = document.getElementsByTagName("a");
    for (i = 0; i < links.length; i++) {
      links[i].addEventListener("click", function () {
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

  showHideDropDown(ddElement: any, show: boolean) {
    if (show) {
      ddElement.classList.remove("hideDropdown");
      ddElement.classList.add("showDropdown");
    } else {
      ddElement.classList.remove("showDropdown");
      ddElement.classList.add("hideDropdown");
    }
  }

  op;
  cl;
  oth;
  currTarget;
  currEl;
  timeCloseElement;
  timeOpenElement;

  add(el: Element, hasSubmenu: boolean) {
    const sh = this.showHideDropDown.bind(this);

    el.addEventListener("click", function () {
      let caret = this.children[1] as HTMLElement;

      var otherDropdowns = document.getElementsByClassName("dropdown-btn");
      let mydropdown = this.nextElementSibling as HTMLElement;

      let allShowDropdowns = document.getElementsByClassName("showDropdown");
      let targetDropdown;

      for (var i = 0; i < allShowDropdowns.length; i++) {
        if (allShowDropdowns[i] != mydropdown) {
          targetDropdown = allShowDropdowns[i];
        }
      }

      if (targetDropdown) {
        let targetPrev = targetDropdown.previousElementSibling as HTMLElement;

        let targetDDCaret = targetPrev.children[1] as HTMLElement;

        targetDDCaret.classList.remove("flip");
      }

      if (targetDropdown) {
        sh(targetDropdown, false);

        targetDropdown.style.display = `none`;
        targetDropdown.style.height = `0px`;
      }

      if (hasSubmenu) {
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.classList.contains("showDropdown")) {
          caret.classList.remove("flip");
          sh(dropdownContent, false);

          clearTimeout(this.cl);
          clearTimeout(this.op);
          clearTimeout(this.oth);

          let linksInDropdown = dropdownContent.getElementsByTagName("a");
          let linksInDropdownArray = Array.from(linksInDropdown);
          let clientHeight = 0;

          if (dropdownContent.style.height === "fit-content") {
            for (let i = 0; i < linksInDropdownArray.length; i++) {
              let lnk = linksInDropdownArray[i] as HTMLElement;
              let compSt = window.getComputedStyle(lnk).height;
              clientHeight += parseFloat(compSt);
            }
            dropdownContent.style.height = `${clientHeight}px`;
          }

          setTimeout(() => {
            dropdownContent.style.height = `0px`;
          }, 1);

          this.currEl = dropdownContent as HTMLElement;
          this.cl = setTimeout(() => {
            dropdownContent.style.display = `none`;
            this.timeCloseElement = dropdownContent;
          }, 300);
        } else {
          caret.classList.add("flip");
          sh(dropdownContent, true);

          clearTimeout(this.cl);
          clearTimeout(this.op);
          clearTimeout(this.oth);

          dropdownContent.style.display = "block";
          let linksInDropdown = dropdownContent.getElementsByTagName("a");
          let linksInDropdownArray = Array.from(linksInDropdown);

          let clientHeight = 0;

          dropdownContent.style.height = "0px";

          for (let i = 0; i < linksInDropdownArray.length; i++) {
            let lnk = linksInDropdownArray[i] as HTMLElement;
            let compSt = window.getComputedStyle(lnk).height;
            clientHeight += parseFloat(compSt);
          }

          setTimeout(() => {
            dropdownContent.style.height = `${clientHeight}px`;
          }, 1);

          this.currEl = dropdownContent as HTMLElement;
          this.op = setTimeout(() => {
            dropdownContent.style.height = `fit-content`;
            this.timeOpenElement = dropdownContent;
          }, 300);
        }
      }
    });
  }

  openShareDocument() {
    this.showShareDocument = true;
  }

  closeShareDocument() {
    this.showShareDocument = false;
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");

    clearInterval(this.autoSaveTimer);
    clearInterval(this.lastManualSaveTimer);

    this.editingDocumentService.changeDocument(null);
    this.editingDocumentService.setReadOnly(null);

    this.editingDocumentService.disconnectSocket();
  }
}
