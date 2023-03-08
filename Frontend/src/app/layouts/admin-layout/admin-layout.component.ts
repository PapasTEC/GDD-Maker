import { Component, OnInit } from "@angular/core";
import Vditor from "vditor";

@Component({
  selector: "app-admin-layout",
  templateUrl: "./admin-layout.component.html",
  styleUrls: ["./admin-layout.component.scss"],
})
export class AdminLayoutComponent implements OnInit {
  sections = [];
  documentTitle = "";
  vditor: Vditor | null = null;

  constructor() {
    this.sections = [
      { sectionName: "High level design", sectionId: "hld" },
      { sectionName: "Low level design", sectionId: "lld" },
      { sectionName: "Test plan", sectionId: "tp" },
      { sectionName: "Test cases", sectionId: "tc" },
      { sectionName: "Test results", sectionId: "tr" },
      { sectionName: "Test summary", sectionId: "ts" },
    ];
    this.documentTitle = "DOCUMENT TITLE GOES HERE";
  }

  ngOnInit() {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    console.log("hola");
    for (i = 0; i < dropdown.length; i++) {
      console.log("a");
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

    this.vditor = new Vditor("vditor", {
      image: {
        preview(bom: Element) {
          console.log(bom);
        },
      },
      upload: {
        handler(files: File[]) {
          console.log(files);
          return "https://hacpai.com/images/2020/04/1586249606.png";
        },
      },
      lang: "en_US",
      mode: "ir",
      // height: 1000,

      toolbarConfig: {
        // pin: false,
        // hide
      },
      // toolbar: [{ name: 'record' }],
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
    setTimeout(() => {
      let fullScreenButton = document.querySelector(
        "#vditor > div.vditor-toolbar > div:nth-child(28) > button"
      );
      let hideSidebarButton = document.querySelector(
        ".share-export-buttons__hide-icon"
      );

      let showSidebarButton = document.querySelector(
        ".open-sidebarEditor-button"
      );

      let sidebarEditor: HTMLElement = document.querySelector("#sidebarEditor");

      let hideToolbarButton = document.querySelector(".hide-toolbar");

      let showToolbarButton = document.querySelector(".show-toolbar");

      let toolbar = document.querySelector(".vditor-toolbar");

      if (!fullScreenButton || !showSidebarButton || !hideSidebarButton) {
        console.log("fullScreenButton or showSidebarButton is null");
        return;
      }

      fullScreenButton.addEventListener("click", () => {
        if (sidebarEditor.classList.contains("hide")) {
          hideSidebarButton.classList.add("hide");
        }
      });

      hideSidebarButton.addEventListener("click", () => {
        // showSidebarButton.classList.remove("hide");
        // showSidebarButton.classList.add("show");
        // sidebarEditor.classList.add("hide");
        // sidebarEditor.classList.remove("show");

        sidebarEditor.classList.remove("show-sidebarEditor");
        sidebarEditor.classList.add("hide-sidebarEditor");

        showSidebarButton.classList.remove("hide-showSidebarButton");
        showSidebarButton.classList.add("show-showSidebarButton");
      });

      showSidebarButton.addEventListener("click", () => {
        // showSidebarButton.classList.add("hide");
        // // sidebarEditor.classList.add("show");
        sidebarEditor.classList.remove("hide-sidebarEditor");
        sidebarEditor.classList.add("show-sidebarEditor");

        showSidebarButton.classList.remove("show-showSidebarButton");
        showSidebarButton.classList.add("hide-showSidebarButton");
      });

      hideToolbarButton.addEventListener("click", () => {
        toolbar.classList.add("hide");
        showToolbarButton.classList.remove("hide");
        hideToolbarButton.classList.add("hide");
      });

      showToolbarButton.addEventListener("click", () => {
        toolbar.classList.remove("hide");
        showToolbarButton.classList.add("hide");
        hideToolbarButton.classList.remove("hide");
      });
    }, 500);
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
}
