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
      theme: "dark"
    });
  }
}
