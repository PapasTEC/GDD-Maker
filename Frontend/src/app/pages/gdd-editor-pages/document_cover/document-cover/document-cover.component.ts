import { Component, ViewEncapsulation } from '@angular/core';
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-document-cover',
  templateUrl: './document-cover.component.html',
  styleUrls: ['../../editorGlobalStyles.scss', './document-cover.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentCoverComponent {

  gameName:string;
  companyName:string;

  authors = [];

  plusIcon = faAdd;
  trashIcon = faTrash;

  lastUpdate:string;

  cover = {GameName: "", GameLogo:"", CompanyLogo:"", CompanyName: "", Authors: this.authors};

  ngOnInit(){
    this.resetAreasSize();
    this.setLastUpdate();

    this.cover.GameName = this.gameName;
    this.cover.CompanyName = this.companyName;

    // setInterval(() => {
    //  console.log(this.cover);
    // }, 1000);

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
  }

  getCurrentDate(){
    const date = new Date();
    let dateString = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    return dateString;
  }

  formatTime(time:number){
    return time<10?`0${time}`:time;
  }

  getCurrentTime(){
    const date = new Date();
    let timeString = `${this.formatTime(date.getHours())}:${this.formatTime(date.getMinutes())}:${this.formatTime(date.getSeconds())}`;
    return timeString;
  }

  setLastUpdate(){
    this.lastUpdate = `${this.getCurrentDate()} AT ${this.getCurrentTime()}`;
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

  public onFileSelected(event: any, element: HTMLElement, isGameLogo: any): void {
    const file = event.target.files[0];
    console.log(element)
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

  private updateLogo(image, target: HTMLElement): void {
    let uploadButton = target;
    uploadButton.style.backgroundImage = `url(${image})`;
    uploadButton.style.backgroundSize = "100% 100%";
    uploadButton.style.backgroundRepeat = "no-repeat";

    let uploadButtonChild = uploadButton.children[1] as HTMLElement;
    
    // Get photo aspect ratio
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
