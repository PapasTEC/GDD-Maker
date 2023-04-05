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

  ngOnInit(){
    this.resetAreasSize();
    this.setLastUpdate();
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
  }

  removeAuthor(index:number){
    this.authors.splice(index, 1);
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
}
