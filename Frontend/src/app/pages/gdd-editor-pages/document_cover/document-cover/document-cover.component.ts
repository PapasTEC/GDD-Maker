import { Component, ViewEncapsulation, AfterViewChecked } from '@angular/core';
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";

import { FinishSetupComponent } from '../../../gdd-setup-pages/finish-setup/finish-setup.component'
import { filter, map, take } from "rxjs/operators";

import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-document-cover',
  templateUrl: './document-cover.component.html',
  styleUrls: ['../../editorGlobalStyles.scss', './document-cover.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [FinishSetupComponent]
})
export class DocumentCoverComponent {

  gameName:string;
  companyName:string;
  gameLogo:string;
  companyLogo:string;
  authors = [];

  plusIcon = faAdd;
  trashIcon = faTrash;

  lastUpdate:string;

  cover = {GameName: "", GameLogo:"", CompanyLogo:"", CompanyName: "", Authors: []};
  collabs = [];
  route: ActivatedRoute;
  section:string;
  subSection:string;
  frontPage: any;

  loaded = true;

  /* Collaborative Editing */
  isBlocked: boolean = false;
  isUserEditing: boolean = false;

  userBlocking: any = null;

  localUser = null;
  decodeToken: any;
  updateSocket: any;
  myInput: boolean = false;
  updateBlockedInterval: any = null;

  firstLoad = false;

  constructor(private editingDocumentService: EditingDocumentService, route: ActivatedRoute, private finishSetup: FinishSetupComponent, private tokenService: TokenService ) {
    this.route = route;
  }

  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
  }

  updateDocument() {
    console.log("SENDING FRONT PAGE", this.frontPage)
    console.log(this.frontPage.documentLogo.length)
    if (!this.editingDocumentService.read_only) {
      this.myInput = true;
    }
    this.frontPage.lastUpdated = new Date().toISOString();
    this.frontPage.documentTitle = this.cover.GameName;

    this.finishSetup.convertTempUrlToBase64(this.cover.GameLogo).then((result) => {
      this.frontPage.documentLogo = result;

      this.frontPage.companyName = this.cover.CompanyName;
      this.finishSetup.convertTempUrlToBase64(this.cover.CompanyLogo).then((result) => {
        this.frontPage.companyLogo = result;
        this.frontPage.collaborators = this.cover.Authors.map((author) => { return author.name });

        // console.log(this.companyName)

        this.editingDocumentService.updateDocumentFrontPage(this.frontPage);
      }).catch((err) => {
        console.log(err);
      });
    }).catch((err) => {

      this.frontPage.documentLogo = this.cover.GameLogo;

      this.frontPage.companyName = this.cover.CompanyName;
      this.finishSetup.convertTempUrlToBase64(this.cover.CompanyLogo).then((result) => {
        this.frontPage.companyLogo = result;
        this.frontPage.collaborators = this.cover.Authors.map((author) => { return author.name });

        // console.log(this.companyName)

        this.editingDocumentService.updateDocumentFrontPage(this.frontPage);
      }).catch((err) => {
        this.frontPage.companyLogo = this.cover.CompanyLogo;
        this.frontPage.collaborators = this.cover.Authors.map((author) => { return author.name });

        // console.log(this.companyName)

        this.editingDocumentService.updateDocumentFrontPage(this.frontPage);
        console.log(err);
      });

      console.log(err);
    });
  }

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

  ngOnInit(){
    this.getSectionAndSubSection(this.route);

      this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

      this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document !== null),
      map((document) =>
        document.frontPage
      ))
      .subscribe((frontPage) => {
        // if the user is editing the document, do not update the document
        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.canBeEdited();

        this.frontPage = frontPage;
        this.gameName = frontPage.documentTitle;
        this.gameLogo = frontPage.documentLogo;
        this.companyName = frontPage.companyName;
        this.companyLogo = frontPage.companyLogo;
        this.authors = frontPage.collaborators.map((collab:string) => { return {name: collab} });

        const gameLogoDoc = document.getElementById("gl") as HTMLElement;
        const companyLogoDoc = document.getElementById("cl") as HTMLElement;

        this.cover.Authors = this.authors;
        this.cover.CompanyLogo = this.companyLogo;

        this.updateLogo(this.gameLogo, gameLogoDoc, false);

        this.updateLogo(this.companyLogo, companyLogoDoc, false);

        this.setLastUpdate(new Date(frontPage.lastUpdated));

        const titleArea = document.getElementById("titl") as HTMLElement;
        const companyArea = document.getElementById("comp") as HTMLElement;

        this.resetAreasSize(titleArea, this.gameName, false);
        this.resetAreasSize(companyArea, this.companyName, false);
        this.cover.GameName = this.gameName;
        this.cover.CompanyName = this.companyName;
        this.loaded = true;

        console.log("UPDATE FRONT PAGE", frontPage)
        console.log(this.frontPage.documentLogo.length)
      });

      this.updateBlockedInterval = setInterval(() => {
        this.updateIsBlocked1s();
      }, 1000);
    // this.editingDocumentService.document$
    //   .pipe(
    //     filter((document) => document !== null),
    //     map((document) =>
    //       document.frontPage
    //     ),
    //     take(1)
    //   )
    //   .subscribe((frontPage) => {
    //     // this.documentSubSection = document;

    //     // this.elevatorPitch = this.documentSubSection.subSectionContent.elevatorPitch;
    //     // this.tagline = this.documentSubSection.subSectionContent.tagline;
    //     // this.genres = this.documentSubSection.subSectionContent.genres;
    //     // this.tags = this.documentSubSection.subSectionContent.tags;

    //     // console.log("DOCUMENTOVICH", document);

    //     this.frontPage = frontPage;
    //     this.gameName = frontPage.documentTitle;
    //     this.gameLogo = frontPage.documentLogo;
    //     this.companyName = frontPage.companyName;
    //     this.companyLogo = frontPage.companyLogo;
    //     this.authors = frontPage.collaborators.map((collab:string) => { return {name: collab} });

    //     const gameLogoDoc = document.getElementById("gl") as HTMLElement;
    //     const companyLogoDoc = document.getElementById("cl") as HTMLElement;

    //     this.cover.Authors = this.authors;
    //     this.cover.CompanyLogo = this.companyLogo;
    //     this.cover.GameLogo = this.gameLogo;

    //     this.updateLogo(this.gameLogo, gameLogoDoc, false);
    //     this.updateLogo(this.companyLogo, companyLogoDoc, false);

    //     this.setLastUpdate(new Date(frontPage.lastUpdated));

    //     const titleArea = document.getElementById("titl") as HTMLElement;
    //     const companyArea = document.getElementById("comp") as HTMLElement;

    //     this.resetAreasSize(titleArea, this.gameName, false);
    //     this.resetAreasSize(companyArea, this.companyName, false);
    //     this.cover.GameName = this.gameName;
    //     this.cover.CompanyName = this.companyName;


    //     this.firstLoad = true;

    //     this.loaded = true;


    //     console.log("PRIMER FRONT PAGE", frontPage);

    //     this.canBeEdited();

    //     this.updateBlockedInterval = setInterval(() => {
    //       this.updateIsBlocked1s();
    //     }, 1000);
    //   });
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

  resetAreasSize(area, _var, callUpdate: boolean = true){

    const targ = area as HTMLTextAreaElement;
    let rows = _var.split("\n").length;

    // console.log("rows: ", _var);

    targ.style.height = `${rows * 1.5}em`;
    targ.rows = rows;

    targ.value = _var;

    while(targ.scrollHeight > targ.clientHeight){
      // console.log("targ.scrollHeight B: ", targ.style.height);
      targ.style.height = `${parseFloat(targ.style.height) + 1.5}em`;
    }

    while(targ.scrollHeight < targ.clientHeight){
      // console.log("targ.scrollHeight A: ", targ.style.height);
      targ.style.height = `${parseFloat(targ.style.height) - 1.5}em`;
    }

    if (callUpdate) {
      console.log("Call update")
      this.updateCoverContent();
    }
  }

  growShrink(ev: Event, var_:string) {
    if (!this.canBeEdited()) {
      ev.preventDefault();
      return;
    }
    let rows = var_.split("\n").length;
    let trgt = ev.target as HTMLTextAreaElement;
    trgt.style.height = `${rows * 1.5}em`;
    trgt.rows = rows;

    this.breakLines(ev, rows);
    this.updateCoverContent();

  }

  updateCoverContent(){
    console.log("UPDATE COVER CONTENT")
    this.cover.Authors = this.authors;
    this.cover.GameName = this.gameName;
    this.cover.CompanyName = this.companyName;
    this.cover.GameLogo = this.gameLogo;
    this.cover.CompanyLogo = this.companyLogo;
    this.updateDocument();
  }

  getFormattedDate(date: Date){
    let dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return dateString;
  }

  formatTime(time:number){
    return time<10?`0${time}`:time;
  }

  getFormattedTime(date: Date){
    let timeString = `${this.formatTime(date.getHours())}:${this.formatTime(date.getMinutes())}:${this.formatTime(date.getSeconds())}`;
    return timeString;
  }

  setLastUpdate(date: Date){
    this.lastUpdate = `${this.getFormattedDate(date)} AT ${this.getFormattedTime(date)}`;
  }

  addAuthor(){
    if (!this.canBeEdited()) {
      return;
    }

    this.authors.push({'name': ""});
    this.updateCoverContent();
  }

  removeAuthor(index:number){
    if (!this.canBeEdited()) {
      return;
    }

    this.authors.splice(index, 1);
    this.updateCoverContent();
  }


  updateTXT(ev: Event, elem: HTMLTextAreaElement, indexInp:string) {
    if (!this.canBeEdited()) {
      ev.preventDefault();
      return;
    }

    const index = parseInt(indexInp);

    this.authors[index].name = elem.value;

    let rows = this.authors[index].name.split("\n").length;
    let trgt = ev.target as HTMLTextAreaElement;
    trgt.style.height = `${rows * 1.5}em`;

    this.breakLines(ev, rows);
    this.updateCoverContent();

  }


  breakLines(ev: Event, rows?:number) {
    const targ = ev.target as HTMLTextAreaElement;


    while(targ.scrollHeight > targ.clientHeight){
      // console.log("targ.scrollHeight B: ", targ.style.height);
      targ.style.height = `${parseFloat(targ.style.height) + 1.5}em`;
    }

    while(targ.scrollHeight < targ.clientHeight){
      // console.log("targ.scrollHeight A: ", targ.style.height);
      targ.style.height = `${parseFloat(targ.style.height) - 1.5}em`;
    }
  }

  ngAfterViewChecked(){
    if(this.loaded){
      const auth = document.getElementById("authCont") as HTMLElement;

        const authsTXTArea = auth.getElementsByTagName("textarea") as HTMLCollectionOf<HTMLElement>;

        for(let i = 0; i < authsTXTArea.length; i++){
          this.resetAreasSize(authsTXTArea[i], this.authors[i].name, this.firstLoad);
        }

        this.loaded = false;
        this.firstLoad = false;

    }

  }


  public onFileSelected(event: any, element: HTMLElement, isGameLogo: any, eventB=false, newF=File): void {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }

    const file = event.target.files[0];
    if (file) {
      const img = URL.createObjectURL(file);

      if(isGameLogo){
        this.cover.GameLogo = img;
      }else{
        this.cover.CompanyLogo = img;
      }

      this.updateLogo(img, element);
    }
  }

  private updateLogo(image, target: HTMLElement, callUpdate: boolean = true): void {
    let uploadButton = target;
    uploadButton.style.backgroundImage = `url(${image})`;
    uploadButton.style.backgroundSize = "100% 100%";
    uploadButton.style.backgroundRepeat = "no-repeat";

    let uploadButtonChild = uploadButton.children[1] as HTMLElement;

    this.transformToImageRatio(image, uploadButton, uploadButtonChild);

    if(uploadButton.id == "gl"){
      this.gameLogo = image;
    }else{
      this.companyLogo = image;
    }

    if (callUpdate) {
      console.log("Call update")
      this.updateCoverContent();
    }

    // Get photo aspect ratio

  }

  transformToImageRatio(image, uploadButton, uploadButtonChild){
    let img = new Image();
    img.src = image;
    img.onload = () => {
      let aspectRatio = img.width / img.height;
      uploadButtonChild.style.display = "none";

      const w = "calc(4vmax * " + (aspectRatio) + ")"
      const h = "4vmax";

        uploadButton.style.width = w;
        uploadButton.style.height = h;

        uploadButton.style.paddingTop = h;
        uploadButton.style.paddingBottom = h;

        uploadButton.style.paddingLeft = w;
        uploadButton.style.paddingRight = w;

    };
  }

  onChangeBlock(event: any) {
    if (!this.canBeEdited()) {
      event.preventDefault();
      return;
    }
  }
}
