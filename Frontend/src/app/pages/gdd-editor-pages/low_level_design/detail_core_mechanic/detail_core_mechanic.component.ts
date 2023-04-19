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

  detailsIds = ["tokens", "resources", "additionalElements", "decisions", "intermediate", "local", "global"];

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

  lineHeight = 0.3;

  resetAreasSize(area, _var, decisions = false){
    
    const targ = area as HTMLTextAreaElement;
    let rows = _var.split("\n").length;

    let heightLine = this.lineHeight;

    targ.rows = rows;
    targ.value = _var;
    
    if (!decisions || rows > 8) {
      targ.style.height = `${rows * heightLine}em`;
    
      while(targ.scrollHeight > targ.clientHeight){
        targ.style.height = `${parseFloat(targ.style.height) + heightLine}em`;
      }

      while(targ.scrollHeight < targ.clientHeight){
        targ.style.height = `${parseFloat(targ.style.height) - heightLine}em`;
      }
    }
  }

  breakLines(ev: Event, rows?:number, decisions = false) {
    const targ = ev.target as HTMLTextAreaElement;
    const heightLine = this.lineHeight;

    if (!decisions || rows > 8) {

      targ.style.height = `${rows * this.lineHeight}em`;
    
      while(targ.scrollHeight > targ.clientHeight){
        targ.style.height = `${parseFloat(targ.style.height) + heightLine}em`;
      }

      while(targ.scrollHeight < targ.clientHeight){
        targ.style.height = `${parseFloat(targ.style.height) - heightLine}em`;
      }
    } else {
      targ.style.height = `${12.2}em`;
    }
  }

  growShrink(ev: Event, var_: String, decisions = false) {
    let rows = var_.split("\n").length;
    let targ = ev.target as HTMLTextAreaElement;
    targ.rows = rows;
    
    this.breakLines(ev, rows, decisions);
    this.updateDocument();
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
      ).subscribe((subsection) => {
        this.documentSubSection = subsection;
        this.details = this.documentSubSection.subSectionContent;

        const textareas = document.getElementsByClassName("resize-ta");
        for (let i = 0; i < textareas.length; i++) {
          let textarea = textareas[i] as HTMLTextAreaElement;
          if (this.detailsIds[i] === "decisions") {
            this.resetAreasSize(textarea, this.details[this.detailsIds[i]], true);
          } else {
            this.resetAreasSize(textarea, this.details[this.detailsIds[i]]);
          }
        }
      });
  }
}
