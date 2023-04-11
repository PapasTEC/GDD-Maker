import { Component, ViewEncapsulation } from '@angular/core';
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { EditingDocumentService } from "src/app/services/editing-document.service";

import { FinishSetupComponent } from '../../../gdd-setup-pages/finish-setup/finish-setup.component'
import { filter, map, take } from "rxjs/operators";

import { ActivatedRoute } from '@angular/router';

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

  ;

  constructor(private editingDocumentService: EditingDocumentService, route: ActivatedRoute, private finishSetup: FinishSetupComponent ) {
    this.route = route;
  }

  getSectionAndSubSection(route:ActivatedRoute){
    route.data.subscribe((data) => {
      this.section = data.section;
      this.subSection = data.subSection;
    });
    
  }

  updateDocument() {
    
    console.log("name", this.gameName)
    this.frontPage.documentTitle = this.cover.GameName;

    this.finishSetup.convertTempUrlToBase64(this.cover.GameLogo).then((result) => {
      this.frontPage.documentLogo = result;
    }).catch((err) => {
      console.log(err);
    });

    this.frontPage.companyName = this.cover.CompanyName;
    this.finishSetup.convertTempUrlToBase64(this.cover.CompanyLogo).then((result) => {
      this.frontPage.companyLogo = result;
    }).catch((err) => {
      console.log(err);
    });
    this.frontPage.collaborators = this.cover.Authors.map((author) => { return author.name });

    console.log("frontPage", this.frontPage);
    console.log(this.companyName)

    this.editingDocumentService.updateDocumentFrontPage(this.frontPage);
  }

  ngOnInit(){
    this.getSectionAndSubSection(this.route);

    console.log("section: ", this.section);
    console.log("subSection: ", this.subSection);

    this.resetAreasSize();
    
    this.editingDocumentService.document$
      .pipe(
        filter((document) => document !== null),
        map((document) =>
          document.frontPage
        ),
        take(1)
      ).subscribe((frontPage) => {

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
        this.cover.GameLogo = this.gameLogo;

        this.updateLogo(this.gameLogo, gameLogoDoc);
        this.updateLogo(this.companyLogo, companyLogoDoc);

        console.log("lu",frontPage.lastUpdated)
        
        this.setLastUpdate(new Date(frontPage.lastUpdated));
        
      });

      this.cover.GameName = this.gameName;
      this.cover.CompanyName = this.companyName;

      
  }

  

  resetAreasSize(){
    console.log("resetAreasSize");
    const areas = document.querySelectorAll('textarea');
    areas.forEach((area) => {
      area.style.height = '1.5em';
    });
  }

  growShrink(ev: Event, var_:string) {
    let rows = var_.split("\n").length;
    let trgt = ev.target as HTMLTextAreaElement;
    trgt.style.height = `${rows * 1.5}em`;
    
    this.breakLines(ev);
    this.updateCoverContent();

  }

  updateCoverContent(){
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
    this.authors.push({'name': ""});
    this.updateCoverContent();
  }

  removeAuthor(index:number){
    this.authors.splice(index, 1);
    this.updateCoverContent();
  }
  

  updateTXT(ev: Event, elem: HTMLTextAreaElement, indexInp:string) {
    

    const index = parseInt(indexInp);
    console.log("index: ", elem.value);

    console.log(ev)

    // if(elem.value == ""){
    //   this.removeAuthor(index);
    //   return;
    // }

    this.authors[index].name = elem.value;
    console.log("authors: ", this.authors);

    let rows = this.authors[index].name.split("\n").length;
    let trgt = ev.target as HTMLTextAreaElement;
    trgt.style.height = `${rows * 1.5}em`;

    this.breakLines(ev);
    this.updateCoverContent();
    
  }


  breakLines(ev: Event) {
    const targ = ev.target as HTMLTextAreaElement;

    
    if(targ.scrollHeight > targ.clientHeight){
      console.log("targ.scrollHeight B: ", targ.style.height);
      targ.style.height = `${parseFloat(targ.style.height) + 1.5}em`;
    }

    if(targ.scrollHeight < targ.clientHeight){
      console.log("targ.scrollHeight A: ", targ.style.height);
      targ.style.height = `${parseFloat(targ.style.height) - 1.5}em`;
    }
  }

  ngAfterViewInit(){
    console.log("ngAfterViewInit");
    this.resetAreasSize();
  }

  


  public onFileSelected(event: any, element: HTMLElement, isGameLogo: any, eventB=false, newF=File): void {
    const file = event.target.files[0];
    console.log("Entra",file)
    if (file) {
      const img = URL.createObjectURL(file);

      console.log("img: ", img);

      if(isGameLogo){
        this.cover.GameLogo = img;
      }else{
        this.cover.CompanyLogo = img;
      }

      this.updateLogo(img, element);


    }
  }

  private updateLogo(image, target: HTMLElement): void {
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

    this.updateCoverContent();
    
    // Get photo aspect ratio
    
  }

  transformToImageRatio(image, uploadButton, uploadButtonChild){
    let img = new Image();
    img.src = image;
    img.onload = () => {
      let aspectRatio = img.width / img.height;
      console.log("aspectRatio: ", aspectRatio);
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
}
