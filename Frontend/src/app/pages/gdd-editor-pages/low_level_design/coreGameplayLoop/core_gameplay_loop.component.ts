import { Component, ViewEncapsulation } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { ActivatedRoute } from "@angular/router";
import { filter, map, take } from "rxjs/operators";

@Component({
  selector: "app-core_gameplay_loop",
  templateUrl: "./core_gameplay_loop.component.html",
  styleUrls: [
    "../../editorGlobalStyles.scss",
    "../../vditor/vditor.component.scss",
    "./core_gameplay_loop.component.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class CoreGameplayLoopComponent {
  constructor(
    private editingDocumentService: EditingDocumentService,
    private route: ActivatedRoute
  ) {
    this.route = route;
  }

  coreGameplayLoopContent = {
    first: "",
    second: "",
    third: "",
    fourth: "",
  };

  section = "Low Level Design";
  subSection = "Core Gameplay Loop";
  documentSubSection: any;

  updateDocument(coreGameplayLoopContent: any) {
    this.documentSubSection.subSectionContent = coreGameplayLoopContent;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  ngOnInit() {
    this.editingDocumentService.document$
      .pipe(
        filter((document) => document),
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
        this.coreGameplayLoopContent =
          this.documentSubSection.subSectionContent;
        console.log("coreGameplayLoopContent:", this.coreGameplayLoopContent);
      });
  }

  onValueChange(event: Event, name: string): void {
    // console.log(event.target);
    const value = (event.target as any).value;
    this.coreGameplayLoopContent[name] = value;
    // console.log("coreGameplayLoopContent:", this.coreGameplayLoopContent);
    this.updateDocument(this.coreGameplayLoopContent);
  }
}
