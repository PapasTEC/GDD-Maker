import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { Location } from "@angular/common";
import { DocumentService } from "src/app/services/document.service";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, timeout } from 'rxjs/operators';
import { faThumbTack } from '@fortawesome/free-solid-svg-icons';
import { EditorLayoutRoutes } from "./editor-layout.routing";

@Component({
  selector: "app-editor-layout",
  templateUrl: "./editor-layout.component.html",
  styleUrls: ["./editor-layout.component.scss"],
  // encapsulation: ViewEncapsulation.None,
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
  pinned = false;

  workspace:HTMLElement;
  hideSideBarButton:HTMLElement;

  // documentLayout:layout[];

  sectionsSubSectionsPath = EditorLayoutRoutes.map( route => {
    return {section: route.data.section, subSection: route.data.subSection, path: route.path}
  } );

  uniqueSections:Set<String> = new Set( 
    this.sectionsSubSectionsPath.map( route => route.section) 
  );
  documentLayout = [...this.uniqueSections].map( section => { return {section: section, subSections: [], paths:[]} } );

  
  

  fillLayout = this.sectionsSubSectionsPath.forEach( route => {

    let currentSection = route.section;
    let curretnSubSection = route.subSection;
    let currentPath = route.path;

    

    let oldSection = this.documentLayout.find( section => section.section === currentSection);
    let index = this.documentLayout.indexOf(oldSection);
    if(currentSection !== curretnSubSection)
      oldSection.subSections.push(curretnSubSection);
    
    oldSection.paths.push(currentPath);
    this.documentLayout[index] = oldSection;
  });

  constructor(private location: Location, private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private editingDocumentService: EditingDocumentService,
    private cdRef: ChangeDetectorRef
    ) { 
      console.log("sectionsSubSectionsPath: ", this.sectionsSubSectionsPath)
      this.route = route;
      console.log("uniqueSections: ", this.uniqueSections)
      console.log("layout: ", this.documentLayout)
    }

  openSidebar() {

    if(!this.pinned){
      if (this.workspace.classList.contains("sidebarHide")) {
        this.workspace.classList.replace("sidebarHide", "sidebarShow");
        this.hideSideBarButton.classList.add("flipHorizontal");
      } else if (this.workspace.classList.contains("sidebarShow")) {
        this.workspace.classList.replace("sidebarShow", "sidebarHide");
        this.hideSideBarButton.classList.remove("flipHorizontal");
      }
    }
    
  }

  keepSidebarClosed() {
    console.log("this.pinned");
    if(!this.pinned){
      this.workspace.classList.replace("sidebarShow", "sidebarHide");
      this.hideSideBarButton.classList.remove("flipHorizontal");
    }
  }

  keepSidebarOpen() {
    this.workspace.classList.replace("sidebarHide", "sidebarShow");
    this.hideSideBarButton.classList.add("flipHorizontal");
  }

  pinnedSidebarColor: string = "#007bff";
  unpinnedSidebarColor: string = "#6c757d";

  toggleKeepSidebarOpen() {
    if(this.pinned){
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
      console.log('Auto save..');
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

  ngOnInit() {
    
    

    this.route.queryParams.subscribe((params) => {
      this.documentId = params.pjt;
    });    

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

    

    
  }
  
  navToStartingSection() {
    this.switchSection("Document Cover");
    let coverLink = document.getElementsByClassName("nActive")[0] as HTMLElement;
    coverLink.classList.remove("nActive");
    coverLink.classList.add("active");
    
    this.router.navigate(["./cover"],{relativeTo: this.route, queryParams: { pjt: this.documentId } });
    
  }

  ngAfterViewInit() {
    
    this.navToStartingSection();

    this.cdRef.detectChanges();

    this.workspace = document.getElementById("workspace");
    this.hideSideBarButton = document.getElementById("showHideSBButton");

    console.log("workspace", this.workspace);

    this.workspace.addEventListener("click", (ev) => {
      const targ = ev.target as HTMLElement;
      if(!targ.classList.contains("open-sidebar-button")){
        this.keepSidebarClosed();
      }
    });
    
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var singleSection = document.getElementsByTagName("a");
    let singleSections = Array.from(singleSection).filter((el) => {
      return el.id === "singleSec"
    });
    
    console.log("dropdown", singleSection, singleSections);
    var i;
    for (i = 0; i < dropdown.length; i++) {
      this.add(dropdown[i], true);
    }

    for (i = 0; i < singleSections.length; i++) {
      this.add(singleSection[i], false);
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

  showHideDropDown(ddElement: any, show: boolean){
    console.log("showHideDropDown", ddElement, show);
    if(show){
      ddElement.classList.remove("hideDropdown");
      ddElement.classList.add("showDropdown");
    }else{
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

  add(el: Element, hasSubmenu: boolean){
    const sh = this.showHideDropDown.bind(this);
    
    
    el.addEventListener("click", function () {
      
      //this.classList.toggle("active");

      let caret = this.children[1] as HTMLElement;
      
      
      var otherDropdowns = document.getElementsByClassName("dropdown-btn");
      let mydropdown = this.nextElementSibling as HTMLElement;

      let allShowDropdowns = document.getElementsByClassName("showDropdown");
      let targetDropdown;

      for(var i = 0; i < allShowDropdowns.length; i++){
        if(allShowDropdowns[i] != mydropdown){
          targetDropdown = allShowDropdowns[i];
        }
      }
      

      if(targetDropdown){
        let targetPrev = targetDropdown.previousElementSibling as HTMLElement;

        let targetDDCaret = targetPrev.children[1] as HTMLElement;

        targetDDCaret.classList.remove("flip");
      }



      if(targetDropdown){
        sh(targetDropdown, false);

        targetDropdown.style.display = `none`;
        targetDropdown.style.height = `0px`;
        
      }
  

      if(hasSubmenu){
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


          if(dropdownContent.style.height === "fit-content"){
            for(let i = 0; i < linksInDropdownArray.length; i++){
              let lnk = linksInDropdownArray[i] as HTMLElement;
              let compSt = window.getComputedStyle(lnk).height
              clientHeight += parseFloat(compSt);
            }
            dropdownContent.style.height = `${clientHeight}px`;
          }
          
          setTimeout(() => {dropdownContent.style.height = `0px`;}, 1);

          this.currEl = dropdownContent as HTMLElement;
          this.cl = setTimeout(() => { dropdownContent.style.display = `none`; this.timeCloseElement = dropdownContent}, 300);

          
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

          for(let i = 0; i < linksInDropdownArray.length; i++){
            let lnk = linksInDropdownArray[i] as HTMLElement;
            let compSt = window.getComputedStyle(lnk).height
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

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");

    clearInterval(this.autoSaveTimer);
    clearInterval(this.lastManualSaveTimer);

    this.editingDocumentService.changeDocument(null);
  }
}