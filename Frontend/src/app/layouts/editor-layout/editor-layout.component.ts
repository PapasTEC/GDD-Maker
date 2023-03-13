import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { DocumentService } from "src/app/services/document.service";
import Vditor from "vditor";
import { changeVditorConfig } from "./veditorConfig";

@Component({
  selector: "app-editor-layout",
  templateUrl: "./editor-layout.component.html",
  styleUrls: ["./editor-layout.component.scss"],
})
export class EditorLayoutComponent implements OnInit {
  sections = [];
  documentTitle = "";
  vditor: Vditor | null = null;
  showToolbar = false;
  documentId = "";

  constructor(private location: Location, private documentService: DocumentService) {
    this.sections = [
      { sectionName: "High level design", sectionId: "hld" },
      { sectionName: "Low level design", sectionId: "lld" },
      { sectionName: "Test plan", sectionId: "tp" },
      { sectionName: "Test cases", sectionId: "tc" },
      { sectionName: "Test results", sectionId: "tr" },
      { sectionName: "Test summary", sectionId: "ts" },
    ];
    this.documentTitle = "DOCUMENT TITLE GOES HERE DOCUMENT TITLE GOES HERE";
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

  toggleToolbar() {
    const content = this.vditor.getValue();
    console.log("content:", content);
    if (this.showToolbar) {
      this.vditor = new Vditor("vditor", changeVditorConfig(false, content));
      this.showToolbar = false;
      document.getElementById("toolbar-toggle-button").style.transform = "rotate(-90deg)";
    } else {
      this.vditor = new Vditor("vditor", changeVditorConfig(true, content));
      this.showToolbar = true;
      document.getElementById("toolbar-toggle-button").style.transform = "rotate(90deg)";
    }
    // this.vditor.setValue(content);
  }

  setDocumentData() {
    this.documentService.getDocument(this.documentId).subscribe((data) => {
      console.log("data:", data);
      this.documentTitle = data['frontPage']['documentTitle'];
    });
  }

  ngOnInit() {
    this.documentId = this.location.getState()['id']

    this.setDocumentData();

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("bg-background");

    this.vditor = new Vditor("vditor", {
      image: {
        preview(bom: Element) {
          console.log(bom);
        },
      },
      upload: {
        accept: 'image/png, image/jpeg',
        token: 'test',
        url: '/api/upload/editor',
        linkToImgUrl: '/api/upload/fetch',
        filename (name) {
          return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
            replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
            replace('/\\s/g', '')
        },
      },
      lang: "en_US",
      mode: "ir",
      // height: 1000,

      toolbarConfig: {
        // hide: true,
        // pin: false,
      },
      // name can be enumerated as: emoji, headings, bold, italic, strike, |, line, quote, list, ordered-list, check, outdent, indent, code, inline-code, insert-after, insert-before, undo, redo, upload, link, table, record, edit-mode, both, preview, fullscreen, outline, code-theme, content-theme, export, devtools, info, help,br
      toolbar: [],
      cache: {
        enable: false,
      },
      after: () => {
        if (this.vditor) {
          this.vditor.setValue("Hello, Vditor + Angular!");
        } else {
          console.log("vditor is null");
        }
      },
      input: (value: string) => {
        console.log("input\n", value);
      },
      theme: "dark",
    });

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

  getValue() {
    if (this.vditor) {
      // alert(this.vditor.getValue());
      console.log("vditor.getValue(): ", this.vditor.getValue());
      console.log(this.vditor.exportJSON(this.vditor.getValue()));
    } else {
      console.log("vditor is null");
    }
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("bg-background");
  }
}


  // changeVditorConfig(toolbar: boolean) : IOptions {
  //   const content = this.vditor.getValue();
  //   return {
  //     image: {
  //       preview(bom: Element) {
  //         console.log(bom);
  //       },
  //     },
  //     // upload: {
  //     //   handler(files: File[]) {
  //     //     console.log(files);
  //     //     return "https://hacpai.com/images/2020/04/1586249606.png";
          
  //     //   },
  //     // },
  //     upload: {
  //       accept: 'image/png, image/jpeg',
  //       token: 'test',
  //       url: '/api/upload/editor',
  //       linkToImgUrl: '/api/upload/fetch',
  //       filename (name) {
  //         return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
  //           replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
  //           replace('/\\s/g', '')
  //       },
  //     },
  //     lang: "en_US",
  //     mode: "ir",
  //     // height: 1000,

  //     toolbarConfig: {
  //       // hide: true,
  //       // pin: false,
  //     },
  //     // name can be enumerated as: emoji, headings, bold, italic, strike, |, line, quote, list, ordered-list, check, outdent, indent, code, inline-code, insert-after, insert-before, undo, redo, upload, link, table, record, edit-mode, both, preview, fullscreen, outline, code-theme, content-theme, export, devtools, info, help, br
  //     toolbar: toolbar ? [
  //       "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", 
  //       "outdent", "indent", "|", "quote", "line", "code", "inline-code", "insert-after",
  //       "insert-before", "|", "link", "table", "|", "undo", "redo"
  //     ]: [],
  //     // toolbar: [ "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", "outdent", "indent",
  //     //   "|", "quote", "line", "code", "inline-code", "insert-after", "insert-before", "|", 
  //     //   {
  //     //     "name": "upload",
  //     //     "tipPosition": "n",
  //     //     "prefix": "<img src=\"",
  //     //     "suffix": "\" alt=\"\" height=\"\" width\"\" />",
  //     //     "icon": "<svg viewBox=\"0 0 1024 1024\" width=\"32\" height=\"32\"><path d=\"M0 0h1024v1024H0z\" fill=\"#FFFFFF\" p-id=\"1962\"></path><path d=\"M384 256V224h-32v32h32z m0 160h-32v32h32v-32z m0 192v-32h-32v32h32z m0 160h-32v32h32v-32z m321.92-265.504l-18.56-26.048a32 32 0 0 0 4.576 54.816l13.984-28.8zM384 288h176V224H384v64z m176 96H384v64h176v-64zM416 416V256h-64v160h64z m192-80a48 48 0 0 1-48 48v64a112 112 0 0 0 112-112h-64zM560 288a48 48 0 0 1 48 48h64A112 112 0 0 0 560 224v64zM384 640h176v-64H384v64z m176 96H384v64h176v-64zM416 768v-160h-64v160h64z m192-80a48 48 0 0 1-48 48v64a112 112 0 0 0 112-112h-64zM560 640a48 48 0 0 1 48 48h64a112 112 0 0 0-112-112v64zM576 64H256v64h320V64zM192 128v768h64V128H192z m64 832h352v-64H256v64z m-64-64a64 64 0 0 0 64 64v-64H192zM256 64a64 64 0 0 0-64 64h64V64z m512 256a191.712 191.712 0 0 1-80.64 156.448l37.152 52.096A255.712 255.712 0 0 0 832 320h-64z m-192-192a192 192 0 0 1 192 192h64a256 256 0 0 0-256-256v64z m224 576a192 192 0 0 1-192 192v64a256 256 0 0 0 256-256h-64z m-108.064-172.736A192 192 0 0 1 800 704h64a256 256 0 0 0-144.064-230.304l-28 57.568z\" fill=\"#000000\" p-id=\"1963\"></path></svg>"
  //     //   }, 
  //     //   "link", "table", "|", "undo", "redo"
  //     // ],
  //     // toolbar: [],
  //     cache: {
  //       enable: false,
  //     },
  //     after: () => {
  //       if (this.vditor) {
  //         this.vditor.setValue(content);
  //       } else {
  //         console.log("vditor is null");
  //       }
  //     },
  //     input: (value: string) => {
  //       console.log("input\n", value);
  //     },
  //     theme: "dark",
  //   }
  // }