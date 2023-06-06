import { Injectable } from '@angular/core';
import Vditor from "vditor";

@Injectable({
  providedIn: 'root'
})
export class VditorService {

  vditor: Vditor | null = null;
  toolbar: boolean = true;

  constructor() {
    this.initVditor("vditor", "", this.toolbar);

  }

  initVditor(id: string, content: string, toolbar: boolean) {
    this.vditor = new Vditor(id, this.changeVditorConfig(toolbar));
    this.vditor.setValue(content);
  }

  getInitVditor(id: string, content: string, toolbar: boolean) {


    this.vditor = new Vditor(id, this.changeVditorConfig(toolbar));
    this.vditor.setValue(content);

    return this.vditor;
  }

  getVditor() {
    return this.vditor;
  }

  changeVditorValue(content: string) {
    this.vditor.setValue(content);
  }

  changeVditorConfig(toolbar: boolean) : IOptions {
    const content = this.vditor.getValue();
    return {
      image: {
        preview(bom: Element) {

        },
      },




          


      upload: {
        accept: 'image/png, image/jpeg',
        token: 'test',
        url: '/api/upload/editor',
        linkToImgUrl: '/api/upload/fetch',
        filename (name) {
          return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
            replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
            replace('/\\s/g', '')
        },
      },
      lang: "en_US",
      mode: "ir",


      toolbarConfig: {


      },

      toolbar: toolbar ? [
        "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", 
        "outdent", "indent", "|", "quote", "line", "code", "inline-code", "insert-after",
        "insert-before", "|", "link", "table", "|", "undo", "redo"
      ]: [],












      cache: {
        enable: false,
      },
      after: () => {
        if (this.vditor) {
          this.vditor.setValue(content);
        } else {

        }
      },
      input: (value: string) => {

      },
      theme: "dark",
    }
  }

}











      






















































