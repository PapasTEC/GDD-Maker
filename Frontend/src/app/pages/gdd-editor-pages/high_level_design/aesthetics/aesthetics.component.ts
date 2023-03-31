import { Component, ViewEncapsulation  } from '@angular/core';
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";


@Component({
  selector: 'app-aesthetics',
  templateUrl: './aesthetics.component.html',
  styleUrls: ['./aesthetics.component.scss', '../../editorGlobalStyles.scss', '../../vditor/vditor.component.scss', '../coreMechanic/coreMechanic.component.scss'],
  encapsulation: ViewEncapsulation.None,
})



export class AestheticsComponent {

  constructor(private editingDocumentService: EditingDocumentService) { }

  allAesthetics = ["Sensation", "Fantasy", "Narrative", "Challenge", "Puzzle","Fellowship", "Discovery", "Expression", "Submission" ];
  aestheticsInDocument:[{name: String, content:String}] = [{name:"", content:""}];

  trashIcon = faTrash;
  plusIcon = faAdd;
  crownIcon = faCrown;

  cardsInDocument = 0;
  limitOfCards = 9;

  section = "High Level Design";
  subSection = "Aesthetic";
  documentSubSection: any;

  updateDocument(aestheticsInDocument: any) {
    console.log("aestheticsInDocument: ", aestheticsInDocument);
    this.documentSubSection.subSectionContent.aesthetics = aestheticsInDocument;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  ngOnInit(){

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
        this.aestheticsInDocument = this.documentSubSection.subSectionContent.aesthetics;
        console.log("aestheticsInDocument:", this.aestheticsInDocument);
        this.cardsInDocument = this.aestheticsInDocument.length;
      });
  }

  functionalComboBox(){}

  showAesthetics(evt: Event, currentAestheticButton: HTMLElement){

    let allAestheticsSelectors = document.getElementsByClassName("aestheticsSelector");
    let subMenuBase = currentAestheticButton.nextSibling as HTMLElement;

    for(let i = 0; i < allAestheticsSelectors.length; i++){
      let subM = allAestheticsSelectors[i] as HTMLElement;
      if(subM != subMenuBase){
        subM.style.display = "none";

      }
    }

    if(this.aestheticsInDocument.length < this.limitOfCards){
      console.log("showAesthetics");
      console.log(evt);

      
      let subMenu = subMenuBase.firstChild as HTMLElement;


      subMenuBase.focus();
      subMenuBase.addEventListener("focusout", () => {
        subMenuBase.style.display = "none";
      });

      console.log(subMenuBase.style.display);

      if(subMenuBase.style.display != "none"){
        subMenuBase.style.display = "none";
      }else{
        subMenuBase.style.display = "block";

        this.loadAesthetics(subMenuBase, currentAestheticButton, true);
      }
    }
  }

  convertToNameArray(array: any[]){
    let nameArray = array.map(aestheticsCard => aestheticsCard.name);

    return nameArray;
  }


  loadAesthetics(subMenuBase: HTMLElement, currentAestheticButton: HTMLElement,open:boolean){
    
    let child = subMenuBase.firstChild as HTMLElement;
    child.innerHTML = "";

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);
    
    let availableAesthetics = this.allAesthetics.filter(aesthetic => !aestheticsNames.includes(aesthetic));

    if(open){
      let index:number = 0;
      availableAesthetics.forEach(aesthetic => {

        if(index!=0){
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

      for(let i = 0; i < buttons.length; i++){
        buttons[i].addEventListener("click", () => {
          this.chooseAesthetic(subMenuBase, buttons[i], buttons[i].innerHTML, currentAestheticButton.children[0].innerHTML);
        });
      }
    }
  }


  chooseAesthetic(menu:HTMLElement, item: HTMLElement, newAesthetic: string, oldAesthetic: string){

    let parent = item.parentElement as HTMLElement;
    let grandparent = parent.parentElement as HTMLElement;
    let beforeGrandparent = grandparent.previousSibling as HTMLElement;

    
    console.log("beforeGrandparent: ", beforeGrandparent);
    beforeGrandparent.innerHTML = beforeGrandparent.innerHTML.replace(oldAesthetic, newAesthetic);

    menu.style.display = "none";

    oldAesthetic = oldAesthetic.trim();

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);
    
    let index = aestheticsNames.indexOf(oldAesthetic);
    this.aestheticsInDocument[index].name = newAesthetic;
 
  }

  addCard(){

    let usedQuantity = this.aestheticsInDocument.length;
    let allQuantity = this.allAesthetics.length;

    this.cardsInDocument = usedQuantity;

    if(this.cardsInDocument == this.limitOfCards){
      alert("You can't add more cards");
      return;
    }

    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);

    let availableAesthetics = this.allAesthetics.filter(aesthetic => !aestheticsNames.includes(aesthetic));

    this.aestheticsInDocument.push({name:availableAesthetics[0], content:""});


    console.log("addCard");

    console.log(this.aestheticsInDocument);
  }

  updateTxtContent(txtArea: HTMLTextAreaElement, aesthetic: string){
    
    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);
    aesthetic = aesthetic.trim();

    this.aestheticsInDocument[aestheticsNames.indexOf(aesthetic)].content = txtArea.value;

    console.log(this.aestheticsInDocument);
    this.updateDocument(this.aestheticsInDocument);
  }



  removeCard(card: HTMLElement){


    
    let aestheticsNames = this.convertToNameArray(this.aestheticsInDocument);

    // element before
    let beforeCard = card.previousSibling as HTMLElement;
    beforeCard = beforeCard.previousSibling as HTMLElement;

    let cardAesthetic = beforeCard.children[0].innerHTML.trim();

    console.log(aestheticsNames);

    console.log("cardAesthetic: " + cardAesthetic);

    let index = aestheticsNames.indexOf(cardAesthetic);

    if(index == -1){
      alert("Error: Aesthetic not found");
    }
    
    console.log(index);

    console.log(this.aestheticsInDocument);

    this.aestheticsInDocument.splice(index, 1);


  }
}
