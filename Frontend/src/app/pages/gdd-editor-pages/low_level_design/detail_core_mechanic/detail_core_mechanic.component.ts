import { Component, ViewEncapsulation  } from '@angular/core';
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { ActivatedRoute } from "@angular/router";
import { filter, map, take } from "rxjs/operators";

@Component({
  selector: 'app-detail_core_mechanic',
  templateUrl: './detail_core_mechanic.component.html',
  styleUrls: ['../../editorGlobalStyles.scss', '../../vditor/vditor.component.scss', './detail_core_mechanic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailCoreMechanicComponent {
  constructor(private editingDocumentService: EditingDocumentService, private route: ActivatedRoute) { this.route = route; }

  details = {
    tokens : "",
    resources : "",
    additionalElements : "",
    decisions : "",
    intermediate : "",
    local : "",
    global : ""
  }

  textMeasurements = {
    minHeight: 20,
    lineHeight: 29,
    padding: 12,
    border: 2
  }

  textArea: any;

  section = "Low Level Design";
  subSection = "Detail of the Core Mechanic";
  documentSubSection: any;

  async getTextMeasurements() {
    let style = window.getComputedStyle(this.textArea, null).getPropertyValue("line-height");
    let lineHeight = parseFloat(style);

    style = window.getComputedStyle(this.textArea, null).getPropertyValue("min-height");
    let minHeight = parseFloat(style);

    style = window.getComputedStyle(this.textArea, null).getPropertyValue("padding");
    let padding = parseFloat(style);

    style = window.getComputedStyle(this.textArea, null).getPropertyValue("border");
    let border = parseFloat(style);

    // console.log("lineHeight2: ", lineHeight2);
    // console.log("minHeight: ", minHeight);
    // console.log("padding: ", padding);
    // console.log("border: ", border);

    this.textMeasurements.lineHeight = lineHeight;
    this.textMeasurements.minHeight = minHeight;
    this.textMeasurements.padding = padding;
    this.textMeasurements.border = border;
  }

  calcHeight(value: any) {
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newHeight = this.textMeasurements.minHeight + numberOfLineBreaks *
      this.textMeasurements.lineHeight + this.textMeasurements.padding +
      this.textMeasurements.border;
    return newHeight;
  }

  updateDocument() {
    this.documentSubSection.subSectionContent = this.details;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
  }

  ngOnInit() {
    this.getSectionAndSubSection(this.route);

    this.textArea = document.getElementById("textarea") as HTMLTextAreaElement;
    window.addEventListener("resize", () => {
      this.getTextMeasurements();
    });
    
    this.getTextMeasurements();

    let textareas = document.getElementsByClassName("resize-ta");
    for (let i = 0; i < textareas.length; i++) {
      let textarea = textareas[i] as HTMLTextAreaElement;
      textarea.addEventListener("keyup", () => {
        textarea.style.height = this.calcHeight(textarea.value) + "px";
      });
    }

    this.editingDocumentService.document$
      .pipe(
        filter((document) => document !== null),
        map((document) =>
          document.documentContent
            .find((section) => section.sectionTitle === this.section)
            .subSections.find(
              (subsection) => subsection.subSectionTitle === this.subSection
            )
        ),
        take(1)
      ).subscribe((document) => {
        this.documentSubSection = document;
        this.details = this.documentSubSection.subSectionContent;
      });
  }
}
