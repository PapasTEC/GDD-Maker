import { Component, ViewEncapsulation, AfterViewChecked   } from '@angular/core';
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { DocumentService } from "src/app/services/document.service";
import { filter, map, take } from "rxjs/operators";
import { ICharacterCard } from './characterCard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FinishSetupComponent } from 'src/app/pages/gdd-setup-pages/finish-setup/finish-setup.component';
import { ChangeDetectorRef } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-characters',
  templateUrl: './characters.component.html',
  styleUrls: ['../../vditor/vditor.component.scss', './characters.component.scss', '../../editorGlobalStyles.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FinishSetupComponent]
})
export class CharactersComponent {

  activatedRoute: ActivatedRoute;
  documentId: string;

  constructor(private cdr: ChangeDetectorRef, private editingDocumentService: EditingDocumentService, private documentService: DocumentService, route: ActivatedRoute, private finishSetup: FinishSetupComponent, private tokenService: TokenService) {
    this.activatedRoute = route;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.documentId = params["pjt"];
    });
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

  /* Collaborative Editing */
  isBlocked: boolean = false;
  isUserEditing: boolean = false;

  userBlocking: any = null;

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

  imagesInfo = [];

  notLoadedComps = false;

  

  public canBeEdited(): boolean {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked = this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
    return !this.isBlocked;
  }

  updateDocument(charactersInDocument: any) {
    this.myInput = true;
    this.documentSubSection.subSectionContent.characters = charactersInDocument;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  interchangeElements(arr, index1, index2) {
    [arr[index1], arr[index2]] = [arr[index2], arr[index1]];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.charactersInDocument, event.previousIndex, event.currentIndex);
    this.interchangeElements(this.imagesInfo, event.previousIndex, event.currentIndex);
  }


  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });

  }

  images = []

  public loadImage = src =>
  new Promise((resolve, reject) => {
    if (!src) {
      resolve(null);
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  async reloadImages(oldImages?: any){
    this.images  = this.documentSubSection.subSectionContent.characters.map((character) => {
      return character.image;
    }
    );















    console.log(this.images)

    this.imagesInfo = []
    let loadedImages = await Promise.all(this.images.map(this.loadImage))
    loadedImages.forEach((img: any, i: number) => {
      if (!img) {
        return null;
      }
      let aspectRatio = img.width / img.height;

      let w;
      let h;

      if(aspectRatio > 1){
        w = "10vmax";
        h = "calc(10vmax * " + (1/aspectRatio) + ")"
      }else{
        w = "calc(10vmax * " + (aspectRatio) + ")"
        h = "10vmax";
      }

      let info = {}
      info["width"] = w;
      info["height"] = h;

      this.imagesInfo[i] = info;
    });

    console.log("this.imagesInfo", this.imagesInfo)

  }

  ngOnInit(){
    this.notLoadedComps = true;
    this.getSectionAndSubSection(this.activatedRoute);

    setInterval(() => {
      if(this.notLoadedComps){
        for (let i = 0; i < this.charactersInDocument.length; i++) {
          if(this.charactersInDocument[i]['image'] !== ""){
            this.updateLogo(i.toString(), this.charactersInDocument[i]['image']);
          }
        }
      }
    }, 1000);

    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.canBeEdited()

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe(async(document) => {

        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited()
        this.notLoadedComps = true;
        let oldImages = this.images;


        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );

              /* *********** */

        this.charactersInDocument = this.documentSubSection.subSectionContent.characters;










        await this.reloadImages(oldImages);
        for (let i = 0; i < this.charactersInDocument.length; i++) {
          if(this.charactersInDocument[i]['image'] !== ""){
            this.updateLogo(i.toString(), this.charactersInDocument[i]['image']);
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
      .subscribe(async (document) => {
        let oldImages = this.images;
        this.documentSubSection = document;

        this.charactersInDocument = document.subSectionContent.characters;

        this.images  = document.subSectionContent.characters.map((character) => {
          return character.image;
        });


        await this.reloadImages(oldImages);

        this.load = true;


        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  updateIsBlocked1s() {
    this.canBeEdited();
  }

  ngOnDestroy() {
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
    if (this.decodeToken) this.decodeToken.unsubscribe();
    if (this.updateSocket) this.updateSocket.unsubscribe();

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
    if (!this.canBeEdited()) {
      return;
    }
    const newCharacterCard = this.createBlankCharacter();
    this.charactersInDocument.push(newCharacterCard);
    this.updateDocument(this.charactersInDocument);


  }

  updateTxtContent(txtArea: HTMLTextAreaElement, field: string, id:string, event: any){
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
    this.charactersInDocument[parseInt(id)][field] = txtArea.value;

    this.updateDocument(this.charactersInDocument);
  }

  uploadedImage: string = "";
































  loadSavedImages(){
    let i = 0;

    this.charactersInDocument.forEach((character, index) => {
      this.uploadedImage = character.image;
      this.updateLogo(i.toString(), this.charactersInDocument[parseInt(i.toString())][`image`]);
      i++;
    });
  }

  hasNonAsciiCharacters(string) {
    const nonAsciiRegex = /[^\x00-\x7F]/;
    return nonAsciiRegex.test(string);
  }

  async saveImageInServer(file, fixName) {
    const formData = new FormData();
    formData.append("image", file, fixName);
    await new Promise((resolve, reject) => {
      this.documentService
        .uploadImage(this.documentId, fixName, formData)
        .subscribe(
          (res) => {},
          (err) => {
            if (err.status === 200) {
              resolve(err);
            } else {
              reject(err);
            }
          }
        );
    });

    return;
  }

  getNewImageName(file: File) {
    let fixName: string;
    


    return file.name;
  }

  


  private async updateLogo(id:string, image) {
    let uploadButton = document.getElementById(`upButton${id}`);
    if(uploadButton !== null){
      this.notLoadedComps = false;
    }
    let img = new Image();
    img.src = image;

    console.log("img", uploadButton)
    uploadButton.style.backgroundImage = `url(${image})`;


    

  }

  public async onFileSelected(
    event: any, field:string, id:string
  ) {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }

    const file = event.target.files[0];

    if (file) {
      let imageName = this.getNewImageName(file);
      let imagePath = `uploads/${this.documentId}/${imageName}`;


      
      this.notLoadedComps = true;
      this.charactersInDocument[parseInt(id)][field] = imagePath;
      


      

      await this.saveImageInServer(file, imageName);
      
      
      
      await this.reloadImages();
      this.notLoadedComps = true;
      this.cdr.detectChanges();
      this.updateDocument(this.charactersInDocument);
      for (let i = 0; i < this.charactersInDocument.length; i++) {
        if(this.charactersInDocument[i]['image'] !== ""){
          this.updateLogo(i.toString(), this.charactersInDocument[i]['image']);
        }
      }

      setTimeout(() => {
        this.cdr.detectChanges();
      }, 10);

      




      
    }
  }

  transformToImageRatio(image, uploadButton, uploadButtonChild) {
    let aspectRatio = image.width / image.height;
    uploadButtonChild.style.display = "none";

    const w = "calc(4vmax * " + aspectRatio + ")";
    const h = "4vmax";

    uploadButton.style.width = w;
    uploadButton.style.height = h;

    uploadButton.style.paddingTop = h;
    uploadButton.style.paddingBottom = h;

    uploadButton.style.paddingLeft = w;
    uploadButton.style.paddingRight = w;
  }


  

  ngAfterViewChecked(){
    





    
  }

  removeCard(card: HTMLElement){
    if (!this.canBeEdited()) {
      return;
    }

    card = card.parentElement.parentElement;

    const cardID = card.id;
    this.imagesInfo.splice(parseInt(cardID), 1);
    this.charactersInDocument.splice(parseInt(cardID), 1);

    card.remove();

    this.updateDocument(this.charactersInDocument);
  }

}
