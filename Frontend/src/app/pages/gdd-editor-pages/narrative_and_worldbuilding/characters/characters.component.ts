import { Component, ViewEncapsulation, AfterViewChecked   } from '@angular/core';
import { faTrash, faAdd, faCrown } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { filter, map, take } from "rxjs/operators";
import { ICharacterCard } from './characterCard';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FinishSetupComponent } from 'src/app/pages/gdd-setup-pages/finish-setup/finish-setup.component';

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

  constructor(private editingDocumentService: EditingDocumentService, route: ActivatedRoute, private finishSetup: FinishSetupComponent, private tokenService: TokenService) {
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

    // if old images is equal to current then do nothing
    if (oldImages && oldImages.length === this.images.length) {
      let equal = true;
      for (let i = 0; i < oldImages.length; i++) {
        if (oldImages[i] !== this.images[i]) {
          equal = false;
          break;
        }
      }
      if (equal) {
        return;
      }
    }

    this.imagesInfo = []
    let loadedImages = await Promise.all(this.images.map(this.loadImage))
    loadedImages.forEach((img: any, i: number) => {
      if (!img) {
        return null;
      }
      let aspectRatio = img.width / img.height;
      // console.log("aspectRatio: ", aspectRatio);
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

    this.getSectionAndSubSection(this.activatedRoute);

    // console.log("section: ", this.section);
    // console.log("subSection: ", this.subSection);

    // this.addDocSectionIfItDoesntExist(this.section);
    // this.addDocSubSectionIfItDoesntExist(this.section, this.subSection, {characters: []} );

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
    //   ).subscribe((document) => {
    //     this.documentSubSection = document;
    //     this.charactersInDocument = document.subSectionContent.characters;

    //     this.images  = document.subSectionContent.characters.map((character) => {
    //       return character.image;
    //     });

    //     this.load = true;

    // });

    /* NEW - COLLABORATIVE */
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
        // if the user is editing the document, do not update the document
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited()
        let oldImages = this.images;
        // filter the document to get the section and subsection
        // and set the techInfo to the subSectionContent to update the information in real time
        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );

              /* *********** */

        this.charactersInDocument = this.documentSubSection.subSectionContent.characters;

        // this.images  = this.documentSubSection.subSectionContent.characters.map((character) => {
        //   return character.image;
        // }
        // );

        // this.loadSavedImages();

        await this.reloadImages(oldImages);
        console.log("charactersInDocument", this.charactersInDocument)
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

        // this.loadSavedImages();
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
    // if (this.editingDocumentService) this.editingDocumentService.unsubscribe();
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
    // console.log("addCard");
    // console.log(this.charactersInDocument);
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

  public async onFileSelected(event: any, field:string, id:string): Promise<void> {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
    const file = event.target.files[0];

    if (file) {
      let uploadedImage = URL.createObjectURL(file);

      // console.log("file", file);

      // console.log("uploadedImage", uploadedImage);


      const base64 = await this.finishSetup.convertTempUrlToBase64(uploadedImage)
      this.charactersInDocument[parseInt(id)][field] = base64;

      // this.updateLogo(id, uploadedImage);
      await this.reloadImages();

      //console.log("asassasd", this.charactersInDocument)

      this.updateDocument(this.charactersInDocument);



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
    console.log("updateLogo", id, image)
    let uploadButton = document.getElementById(`upButton${id}`);

    if (!uploadButton) {
      return;
    }


    uploadButton.style.backgroundImage = `url(${image})`;

    console.log("uploadButton", uploadButton)
    console.log("Id", id)
    console.log("Image", image)

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
    if (!this.canBeEdited()) {
      return;
    }

    card = card.parentElement.parentElement;

    const cardID = card.id;
    this.charactersInDocument.splice(parseInt(cardID), 1);

    card.remove();

    this.updateDocument(this.charactersInDocument);
  }

}
