import { Component, ViewEncapsulation  } from '@angular/core';
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { ActivatedRoute } from "@angular/router";
import { filter, map, take } from "rxjs/operators";
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-detail_core_mechanic',
  templateUrl: './detail_core_mechanic.component.html',
  styleUrls: ['../../editorGlobalStyles.scss', '../../vditor/vditor.component.scss', './detail_core_mechanic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailCoreMechanicComponent {
  constructor(private editingDocumentService: EditingDocumentService, private route: ActivatedRoute, private tokenService: TokenService) { this.route = route; }

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

  /* Collaborative Editing */
  isBlocked: any = {
    representation: null,
    decisions: null,
    goals: null
  }

  userBlocking: any = {
    representation: null,
    decisions: null,
    goals: null
  }

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

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

  growShrink(ev: Event, var_: String, decisions = false, part: string) {
    if (!this.canBeEdited(part)) {
      ev.preventDefault();
      return;
    }
    let rows = var_.split("\n").length;
    let targ = ev.target as HTMLTextAreaElement;
    targ.rows = rows;

    this.breakLines(ev, rows, decisions);
    this.updateDocument(part);
  }

  updateDocument(part: string) {
    this.myInput = true;
    this.documentSubSection.subSectionContent = this.details;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection,
      part
    );
  }

  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
  }

  public canBeEdited(part: string): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isBlocked[part] =
      userEditing[part] && userEditing[part].email !== this.localUser;
    if (this.isBlocked[part]) {
      this.userBlocking[part] = userEditing[part];
    }
    return !this.isBlocked[part];
  }

  ngOnInit() {
    this.getSectionAndSubSection(this.route);

    // this.editingDocumentService.document$
    //   .pipe(
    //     filter((document) => document !== null),
    //     map((document) =>
    //       document.documentContent
    //         .find((section) => section.sectionTitle === this.section)
    //         .subSections.find(
    //           (subsection) => subsection.subSectionTitle === this.subSection
    //         )
    //     ),
    //     take(1)
    //   ).subscribe((subsection) => {
    //     this.documentSubSection = subsection;
    //     this.details = this.documentSubSection.subSectionContent;

    //     const textareas = document.getElementsByClassName("resize-ta");
    //     for (let i = 0; i < textareas.length; i++) {
    //       let textarea = textareas[i] as HTMLTextAreaElement;
    //       if (this.detailsIds[i] === "decisions") {
    //         this.resetAreasSize(textarea, this.details[this.detailsIds[i]], true);
    //       } else {
    //         this.resetAreasSize(textarea, this.details[this.detailsIds[i]]);
    //       }
    //     }
    //   });

        /* NEW - COLLABORATIVE */
        this.decodeToken = this.tokenService
        .decodeToken()
        .subscribe((data: any) => {
          this.localUser = data.decoded.email;
        });

        this.updateSocket = this.editingDocumentService
        .updateDocumentSocket()
        .pipe(filter((document) => document.socketSubSection === this.subSection))
        .subscribe((document) => {
          // if the user is editing the document, do not update the document
          if (this.myInput) {
            this.myInput = false;
            return;
          }

          this.canBeEdited("representation");
          this.canBeEdited("decisions");
          this.canBeEdited("goals");

          // filter the document to get the section and subsection
          // and set the techInfo to the subSectionContent to update the information in real time
          this.documentSubSection = document.documentContent
            .find((section) => section.sectionTitle === this.section)
            .subSections.find(
              (subsection) => subsection.subSectionTitle === this.subSection
            );

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
        )
        .subscribe((document) => {
          this.documentSubSection = document;

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

          console.log(this.documentSubSection);

          this.updateBlockedInterval = setInterval(() => {
            this.updateIsBlocked1s();
          }, 1000);
        });

  }

  updateIsBlocked1s() {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];

    for (const key in this.isBlocked) {
      if (this.isBlocked.hasOwnProperty(key)) {
        console.log("key: ", key)
        console.log(this.isBlocked[key], userEditing[key], userEditing[key].email)
        this.isBlocked[key] =
          userEditing[key] && userEditing[key].email !== this.localUser;
        if (this.isBlocked[key]) {
          this.userBlocking[key] = userEditing[key];
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();
    // if (this.editingDocumentService) this.editingDocumentService.unsubscribe();
  }

  onChangeBlock(event: any, part: string) {
    if (!this.canBeEdited(part)) {
      event.preventDefault();
      return;
    }
  }
}

