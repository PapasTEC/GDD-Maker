import { Component, ViewEncapsulation  } from '@angular/core';
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ICharacterCard } from './characterCard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['../../editorGlobalStyles.scss', '../../vditor/vditor.component.scss', './characters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CharactersComponent {
  constructor(private editingDocumentService: EditingDocumentService) { }

  allAesthetics = ["Sensation", "Fantasy", "Narrative", "Challenge", "Puzzle","Fellowship", "Discovery", "Expression", "Submission" ];
  charactersInDocument:ICharacterCard[] = [];

  trashIcon = faTrash;
  plusIcon = faAdd;
  crownIcon = faCrown;

  cardsInDocument = 0;
  limitOfCards = 9;

  section = "High Level Design";
  subSection = "Aesthetic";
  documentSubSection: any;
  characterCardKeys = Object.keys(this.createBlankCharacter());


  updateDocument(charactersInDocument: any) {
    console.log("charactersInDocument: ", charactersInDocument);
    this.documentSubSection.subSectionContent.aesthetics = charactersInDocument;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.charactersInDocument, event.previousIndex, event.currentIndex);
    
  }

  ngOnInit(){

    //this.charactersInDocument = [this.createBlankCharacter()];

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
        this.charactersInDocument = this.documentSubSection.subSectionContent.aesthetics;
        console.log("charactersInDocument:", this.charactersInDocument);
        this.cardsInDocument = this.charactersInDocument.length;
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

    if(this.charactersInDocument.length < this.limitOfCards){
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

    let aestheticsNames = this.convertToNameArray(this.charactersInDocument);
    
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

    let aestheticsNames = this.convertToNameArray(this.charactersInDocument);
    
    let index = aestheticsNames.indexOf(oldAesthetic);
    this.charactersInDocument[index].name = newAesthetic;
 
  }


  createBlankCharacter(): ICharacterCard {
      const blankCharacter: ICharacterCard = {
          "image": "",
          "name":"",
          "age": "",
          "gender":"",
          "profession":"",
          "bio": "",
          "virtues":"",
          "flaws":"",
          "goals":""
      }

      return blankCharacter;
  }

  addCard(){

    const newCharacterCard = this.createBlankCharacter();
    this.charactersInDocument.push(newCharacterCard);
    console.log("addCard");
    console.log(this.charactersInDocument);
    
  }

  updateTxtContent(txtArea: HTMLTextAreaElement, field: string, id:string){
    
    console.log(txtArea.value);
    this.charactersInDocument[parseInt(id)][field] = txtArea.value;

    console.log(this.charactersInDocument);
  }

  uploadedImage: string = "";

  public onFileSelected(event: any, field:string, id:string): void {
    const file = event.target.files[0];

    if (file) {
      this.uploadedImage = URL.createObjectURL(file);

      this.updateLogo(id);

      this.charactersInDocument[parseInt(id)][field] = this.uploadedImage;

      // if (sessionStorage.getItem("currentSetup") !== null) {
      //   this.setSessionStorageContent(this.routeUsingComponent);
      // }
    }
  }

  private updateLogo(id:string): void {
    let uploadButton = document.getElementById(`upButton${id}`);
    uploadButton.style.backgroundImage = `url(${this.uploadedImage})`;
    uploadButton.style.backgroundSize = "100%";
    uploadButton.style.backgroundRepeat = "no-repeat";
    uploadButton.style.backgroundPosition = "center";
    uploadButton.style.zIndex = "1";
    // fit image to button

    

    //Get child element of upload button
    let uploadButtonChild = uploadButton.children[1] as HTMLElement;
    uploadButtonChild.style.display = "none";
  }



  removeCard(card: HTMLElement){

    console.log(card)

    // Go back 3 elements to get the card
    card = card.parentElement.parentElement;

    const cardID = card.id;
    

    console.log("Removing card: ", parseInt(cardID))

    this.charactersInDocument.splice(parseInt(cardID), 1);

     
    card.remove();

  }
}
