import { Component, ViewEncapsulation  } from '@angular/core';
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ICharacterCard } from './characterCard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['../../editorGlobalStyles.scss', '../../vditor/vditor.component.scss', './characters.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CharactersComponent {

  activatedRoute: ActivatedRoute;

  constructor(private editingDocumentService: EditingDocumentService, route: ActivatedRoute) {
    this.activatedRoute = route;
   }

  allAesthetics = ["Sensation", "Fantasy", "Narrative", "Challenge", "Puzzle","Fellowship", "Discovery", "Expression", "Submission" ];
  charactersInDocument:ICharacterCard[] = [];

  trashIcon = faTrash;
  plusIcon = faAdd;
  crownIcon = faCrown;

  cardsInDocument = 0;
  limitOfCards = 9;

  section:string;
  subSection:string;
  documentSubSection: any;
  characterCardKeys = Object.keys(this.createBlankCharacter());
  

  updateDocument(charactersInDocument: any) {
    this.documentSubSection.subSectionContent.characters = charactersInDocument;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.charactersInDocument, event.previousIndex, event.currentIndex);
    
  }


  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
    
  }

  ngOnInit(){

    this.getSectionAndSubSection(this.activatedRoute);

    console.log("section: ", this.section);
    console.log("subSection: ", this.subSection);

    // this.addDocSectionIfItDoesntExist(this.section);
    // this.addDocSubSectionIfItDoesntExist(this.section, this.subSection, {characters: []} );

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
        this.charactersInDocument = document.subSectionContent.characters;

        console.log("charactersInDocument: ", this.charactersInDocument)
    });
  }


  addDocSectionIfItDoesntExist(section:string){
    this.editingDocumentService.document$.pipe(
      filter((document) => document !== null),
      map((document) => document.documentContent.map( d => {return d.sectionTitle;}).includes(section)),
      take(1)
    ).subscribe(
      (sectionExists) => {
        if(!sectionExists){
          this.editingDocumentService.addDocumentSection(section);
        }
        
      }
    );
  }

  addDocSubSectionIfItDoesntExist(section:string, subSection:string, content:any){
    this.editingDocumentService.document$.pipe(
      filter((document) => document !== null),
      map((document) => document.documentContent.find( d => {return d.sectionTitle === section;}).subSections.map( s => {return s.subSectionTitle;}).includes(subSection)),
      take(1)
    ).subscribe(
      (subSectionExists) => {
        if(!subSectionExists){
          this.editingDocumentService.addDocumentSubSection(section, subSection, content);
        }
      }
    );
  }

  functionalComboBox(){}


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

    this.charactersInDocument[parseInt(id)][field] = txtArea.value;
    
  }

  uploadedImage: string = "";

  public onFileSelected(event: any, field:string, id:string): void {
    const file = event.target.files[0];

    if (file) {
      this.uploadedImage = URL.createObjectURL(file);

      console.log("file", file);

      this.updateLogo(id);

      this.charactersInDocument[parseInt(id)][field] = this.uploadedImage;

    }
  }


  loadSavedImages(){
    let i = 0;
    this.charactersInDocument.forEach((character, index) => {
      this.updateLogo(i.toString());
      i++;
    });
  }


  private updateLogo(id:string): void {
    let uploadButton = document.getElementById(`upButton${id}`);
    uploadButton.style.backgroundImage = `url(${this.uploadedImage})`;

    uploadButton.style.maxHeight = "100%";
    uploadButton.style.maxWidth = "100%";
    uploadButton.style.backgroundRepeat = "no-repeat";
    uploadButton.style.backgroundPosition = "center";
    uploadButton.style.backgroundSize = "cover";

    let uploadButtonChild = uploadButton.children[1] as HTMLElement;
    uploadButtonChild.style.display = "none";

  }



  removeCard(card: HTMLElement){
    card = card.parentElement.parentElement;

    const cardID = card.id;
    this.charactersInDocument.splice(parseInt(cardID), 1);

    card.remove();
  }
}
