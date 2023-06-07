import { Component, ViewEncapsulation } from "@angular/core";
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ToastrService } from "ngx-toastr";
import { TokenService } from "src/app/services/token.service";

@Component({
  selector: "app-aesthetics",
  templateUrl: "./aesthetics.component.html",
  styleUrls: [
    "./aesthetics.component.scss",
    "../../editorGlobalStyles.scss",
    "../../vditor/vditor.component.scss",
    "../coreMechanic/coreMechanic.component.scss",
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AestheticsComponent {
  constructor(
    private editingDocumentService: EditingDocumentService,
    private tostr: ToastrService,
    private tokenService: TokenService
  ) {}

  allAesthetics = [
    "Sensation",
    "Fantasy",
    "Narrative",
    "Challenge",
    "Puzzle",
    "Fellowship",
    "Discovery",
    "Expression",
    "Submission",
  ];
  aestheticsInDocument: [{ name: String; content: String }] = [
    { name: "", content: "" },
  ];

  trashIcon = faTrash;
  plusIcon = faAdd;
  crownIcon = faCrown;

  cardsInDocument = 0;
  limitOfCards = 9;

  section = "High Level Design";
  subSection = "Aesthetic";
  documentSubSection: any;

  /* Collaborative Editing */
  isBlocked: boolean = false;
  isUserEditing: boolean = false;

  userBlocking: any = null;

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

  updateDocument(aestheticsInDocument: any) {
    this.myInput = true;
    this.documentSubSection.subSectionContent.aesthetics = aestheticsInDocument;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  public canBeEdited(): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked =
      this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
    return !this.isBlocked;
  }

  ngOnInit() {
    /* NEW - COLLABORATIVE */

    this.canBeEdited();

    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited();

        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );

        this.aestheticsInDocument =
          this.documentSubSection.subSectionContent.aesthetics;

        this.cardsInDocument = this.aestheticsInDocument.length;
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

        this.aestheticsInDocument =
          this.documentSubSection.subSectionContent.aesthetics;

        this.cardsInDocument = this.aestheticsInDocument.length;

        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();
  }

  updateIsBlocked1s() {
    this.canBeEdited();
  }

  functionalComboBox() {}

  showAesthetics(evt: Event, currentAestheticButton: HTMLElement) {
    let allAestheticsSelectors =
      document.getElementsByClassName("aestheticsSelector");
    let subMenuBase = currentAestheticButton.nextSibling as HTMLElement;

    for (let i = 0; i < allAestheticsSelectors.length; i++) {
      let subM = allAestheticsSelectors[i] as HTMLElement;
      if (subM != subMenuBase) {
        subM.style.display = "none";
      }
    }

    if (this.aestheticsInDocument.length < this.limitOfCards) {
      let subMenu = subMenuBase.firstChild as HTMLElement;

      subMenuBase.focus();
      subMenuBase.addEventListener("focusout", () => {
        subMenuBase.style.display = "none";
      });

      if (subMenuBase.style.display != "none") {
        subMenuBase.style.display = "none";
      } else {
        subMenuBase.style.display = "block";

        this.loadAesthetics(subMenuBase, currentAestheticButton, true);
      }
    }
  }

  convertToNameArray(array: any[]) {
    let nameArray = array.map((aestheticsCard) => aestheticsCard.name);

    return nameArray;
  }

  loadAesthetics(
    subMenuBase: HTMLElement,
    currentAestheticButton: HTMLElement,
    open: boolean
  ) {
    let child = subMenuBase.firstChild as HTMLElement;
    child.innerHTML = "";

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);

    let availableAesthetics = this.allAesthetics.filter(
      (aesthetic) => !aestheticsNames.includes(aesthetic)
    );

    if (open) {
      let index: number = 0;
      availableAesthetics.forEach((aesthetic) => {
        if (index != 0) {
          child.innerHTML += `<div class="horizontalLine"></div>`;
        }

        const newButton = document.createElement("button");
        newButton.setAttribute("type", "button");
        newButton.setAttribute("id", index.toString());
        newButton.setAttribute("class", "btn");
        newButton.innerHTML = aesthetic;
        child.appendChild(newButton);

        index++;
      });

      let buttons = child.getElementsByTagName("button");

      for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", () => {
          this.chooseAesthetic(
            subMenuBase,
            buttons[i],
            buttons[i].innerHTML,
            currentAestheticButton.children[0].innerHTML
          );
        });
      }
    }
  }

  chooseAesthetic(
    menu: HTMLElement,
    item: HTMLElement,
    newAesthetic: string,
    oldAesthetic: string
  ) {
    if (!this.canBeEdited()) {
      return;
    }
    let parent = item.parentElement as HTMLElement;
    let grandparent = parent.parentElement as HTMLElement;
    let beforeGrandparent = grandparent.previousSibling as HTMLElement;

    beforeGrandparent.innerHTML = beforeGrandparent.innerHTML.replace(
      oldAesthetic,
      newAesthetic
    );

    menu.style.display = "none";

    oldAesthetic = oldAesthetic.trim();

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);

    let index = aestheticsNames.indexOf(oldAesthetic);
    this.aestheticsInDocument[index].name = newAesthetic;

    this.updateDocument(this.aestheticsInDocument);
  }

  addCard() {
    if (!this.canBeEdited()) {
      return;
    }

    let usedQuantity = this.aestheticsInDocument.length;
    let allQuantity = this.allAesthetics.length;

    this.cardsInDocument = usedQuantity;

    if (this.cardsInDocument == this.limitOfCards) {
      this.tostr.warning("You can't add more cards", "Warning");
      return;
    }

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);

    let availableAesthetics = this.allAesthetics.filter(
      (aesthetic) => !aestheticsNames.includes(aesthetic)
    );

    this.aestheticsInDocument.push({
      name: availableAesthetics[
        Math.floor(Math.random() * (availableAesthetics.length - 1))
      ],
      content: "",
    });

    this.updateDocument(this.aestheticsInDocument);
  }

  updateTxtContent(
    txtArea: HTMLTextAreaElement,
    aesthetic: string,
    event: any
  ) {
    if (!this.canBeEdited()) {
      console.log("can't be edited");
      event.preventDefault();
      console.log(event);
      return;
    }

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);
    aesthetic = aesthetic.trim();

    this.aestheticsInDocument[aestheticsNames.indexOf(aesthetic)].content =
      txtArea.value;

    this.updateDocument(this.aestheticsInDocument);
  }

  removeCard(card: HTMLElement) {
    if (!this.canBeEdited()) {
      return;
    }

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);

    let beforeCard = card.previousSibling as HTMLElement;
    beforeCard = beforeCard.previousSibling as HTMLElement;

    let cardAesthetic = beforeCard.children[0].innerHTML.trim();

    let index = aestheticsNames.indexOf(cardAesthetic);

    if (index == -1) {
      this.tostr.error("Error: Aesthetic not found", "Error");
    }

    this.aestheticsInDocument.splice(index, 1);

    this.updateDocument(this.aestheticsInDocument);
  }

  onChangeBlock(event: any) {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
  }
}
