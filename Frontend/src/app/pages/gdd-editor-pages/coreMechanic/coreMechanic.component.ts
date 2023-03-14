import { Component } from "@angular/core";
import Vditor from "vditor";
import { EditingDocumentService } from 'src/app/services/editing-document.service';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: "app-coreMechanic",
  templateUrl: "./coreMechanic.component.html",
  styleUrls: ["./coreMechanic.component.scss"],
})
export class CoreMechanicComponent {
  vditor1: Vditor | null = null;
  vditor2: Vditor | null = null;
  vditor3: Vditor | null = null;
  vditor4: Vditor | null = null;
  coreMechanicContent = {
    coreMechanic: "",
    secondary: "",
    progression: "",
    metaphore: "",
  };

  section = "High Level Design";
  subSection = "Core Mechanic";
  documentSubSection: any;

  constructor(private editingDocumentService: EditingDocumentService) {}

  updateDocument(coreMechanicContent: any) {
    console.log("coreMechanicContent: ", coreMechanicContent);
    this.documentSubSection.subSectionContent = coreMechanicContent;
    this.editingDocumentService.updateDocumentSubSection(this.section, this.subSection, this.documentSubSection);
  }

  ngOnInit() {

    this.editingDocumentService.document$.pipe(
      filter(document => document !== null),
      map(document => document.documentContent.find(section => 
        section.sectionTitle === this.section).subSections.find(subsection => 
          subsection.subSectionTitle === this.subSection)),
      take(1)
    ).subscribe((document) => {
      this.documentSubSection = document;
      this.coreMechanicContent = this.documentSubSection.subSectionContent;
      console.log("coreMechanicContent:", this.coreMechanicContent);
    });

    (this.vditor1 = new Vditor(
      "vditor1",
      this.changeVditorConfig(
        "Metaphore...",
        this.coreMechanicContent["metaphore"],
        0
      )
    )),
      (this.vditor2 = new Vditor(
        "vditor2",
        this.changeVditorConfig(
          "Progression...",
          this.coreMechanicContent["progression"],
          1
        )
      ));
    this.vditor3 = new Vditor(
      "vditor3",
      this.changeVditorConfig(
        "Secondary...",
        this.coreMechanicContent["secondary"],
        2
      )
    );
    this.vditor4 = new Vditor(
      "vditor4",
      this.changeVditorConfig(
        "Core Mechanic...",
        this.coreMechanicContent["coreMechanic"],
        3
      )
    );
  }

  changeVditorConfig(
    placeholder: string,
    content: string,
    index: number
  ): IOptions {
    return {
      value: content,
      placeholder: placeholder,
      toolbar: [],
      lang: "en_US",
      mode: "ir",
      cache: {
        enable: false,
      },
      after: () => {},
      input: (value: string) => {},
      theme: "dark",
    };
  }
}
