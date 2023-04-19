import { Component, ViewEncapsulation, AfterViewChecked   } from '@angular/core';
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ICharacterCard } from './characterCard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FinishSetupComponent } from 'src/app/pages/gdd-setup-pages/finish-setup/finish-setup.component';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['../../vditor/vditor.component.scss', './characters.component.scss', '../../editorGlobalStyles.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FinishSetupComponent]
})
export class CharactersComponent {

  activatedRoute: ActivatedRoute;

  constructor(private editingDocumentService: EditingDocumentService, route: ActivatedRoute, private finishSetup: FinishSetupComponent) {
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
   
   load= false;

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

  images = []

  ngOnInit(){

    this.getSectionAndSubSection(this.activatedRoute);

    // console.log("section: ", this.section);
    // console.log("subSection: ", this.subSection);

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

        this.images  = document.subSectionContent.characters.map((character) => {
          return character.image;
        });

        this.load = true;

        

        
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
    // console.log("addCard");
    // console.log(this.charactersInDocument);
  }

  updateTxtContent(txtArea: HTMLTextAreaElement, field: string, id:string){

    this.charactersInDocument[parseInt(id)][field] = txtArea.value;
    
  }

  uploadedImage: string = "";

  public onFileSelected(event: any, field:string, id:string): void {
    const file = event.target.files[0];

    if (file) {
      let uploadedImage = URL.createObjectURL(file);

      // console.log("file", file);

      // console.log("uploadedImage", uploadedImage);

      
      this.finishSetup.convertTempUrlToBase64(uploadedImage).then((base64) => {
        this.charactersInDocument[parseInt(id)][field] = base64;
      }).catch((err) => {
        console.log("err", err);
      });

      this.updateLogo(id, uploadedImage);

      //console.log("asassasd", this.charactersInDocument)


    }
  }


  loadSavedImages(){
    let i = 0;
    //console.log("loadSavedImages", this.charactersInDocument);
    this.charactersInDocument.forEach((character, index) => {
      this.uploadedImage = character.image;
      this.updateLogo(i.toString(), this.charactersInDocument[parseInt(i.toString())][`image`]);
      i++;
    });
  }


  private updateLogo(id:string, image): void {
    let uploadButton = document.getElementById(`upButton${id}`);

    uploadButton.style.backgroundImage = `url(${image})`;

    uploadButton.style.maxHeight = "100%";
    uploadButton.style.maxWidth = "100%";
    uploadButton.style.backgroundRepeat = "no-repeat";
    uploadButton.style.backgroundPosition = "center";
    uploadButton.style.backgroundSize = "cover";

    let uploadButtonChild = uploadButton.children[1] as HTMLElement;
    uploadButtonChild.style.display = "none";

    this.transformToImageRatio(image, uploadButton, uploadButtonChild);

  }
  

  transformToImageRatio(image, uploadButton, uploadButtonChild){
    let img = new Image();
    img.src = image;
    img.onload = () => {
      let aspectRatio = img.width / img.height;
      // console.log("aspectRatio: ", aspectRatio);
      uploadButtonChild.style.display = "none";

      let w;
      let h;

      if(aspectRatio > 1){
        w = "10vmax";
        h = "calc(10vmax * " + (1/aspectRatio) + ")"
      }else{
        w = "calc(10vmax * " + (aspectRatio) + ")"
        h = "10vmax";
      }
      

        uploadButton.style.width = w;
        uploadButton.style.height = h;

      
    };
  }

  ngAfterViewChecked(){
    if(this.load){
      this.load = false;
      for (let i = 0; i < this.charactersInDocument.length; i++) {
        if(this.charactersInDocument[i]['image'] !== ""){
          this.updateLogo(i.toString(), this.charactersInDocument[i]['image']);
        }
      }
    }
  }

  removeCard(card: HTMLElement){
    card = card.parentElement.parentElement;

    const cardID = card.id;
    this.charactersInDocument.splice(parseInt(cardID), 1);

    card.remove();
  }

}
