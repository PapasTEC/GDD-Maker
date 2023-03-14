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
    console.log("1: ", this.vditor);
  }

  initVditor(id: string, content: string, toolbar: boolean) {
    this.vditor = new Vditor(id, this.changeVditorConfig(toolbar));
    this.vditor.setValue(content);
  }

  getInitVditor(id: string, content: string, toolbar: boolean) {
    console.log("Si existo");
    console.log("2: ", this.vditor);
    this.vditor = new Vditor(id, this.changeVditorConfig(toolbar));
    this.vditor.setValue(content);
    console.log("3: ", this.vditor);
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
          console.log(bom);
        },
      },
      // upload: {
      //   handler(files: File[]) {
      //     console.log(files);
      //     return "https://hacpai.com/images/2020/04/1586249606.png";
          
      //   },
      // },
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
      // height: 1000,

      toolbarConfig: {
        // hide: true,
        // pin: false,
      },
      // name can be enumerated as: emoji, headings, bold, italic, strike, |, line, quote, list, ordered-list, check, outdent, indent, code, inline-code, insert-after, insert-before, undo, redo, upload, link, table, record, edit-mode, both, preview, fullscreen, outline, code-theme, content-theme, export, devtools, info, help, br
      toolbar: toolbar ? [
        "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", 
        "outdent", "indent", "|", "quote", "line", "code", "inline-code", "insert-after",
        "insert-before", "|", "link", "table", "|", "undo", "redo"
      ]: [],
      // toolbar: [ "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", "outdent", "indent",
      //   "|", "quote", "line", "code", "inline-code", "insert-after", "insert-before", "|", 
      //   {
      //     "name": "upload",
      //     "tipPosition": "n",
      //     "prefix": "<img src=\"",
      //     "suffix": "\" alt=\"\" height=\"\" width\"\" />",
      //     "icon": "<svg viewBox=\"0 0 1024 1024\" width=\"32\" height=\"32\"><path d=\"M0 0h1024v1024H0z\" fill=\"#FFFFFF\" p-id=\"1962\"></path><path d=\"M384 256V224h-32v32h32z m0 160h-32v32h32v-32z m0 192v-32h-32v32h32z m0 160h-32v32h32v-32z m321.92-265.504l-18.56-26.048a32 32 0 0 0 4.576 54.816l13.984-28.8zM384 288h176V224H384v64z m176 96H384v64h176v-64zM416 416V256h-64v160h64z m192-80a48 48 0 0 1-48 48v64a112 112 0 0 0 112-112h-64zM560 288a48 48 0 0 1 48 48h64A112 112 0 0 0 560 224v64zM384 640h176v-64H384v64z m176 96H384v64h176v-64zM416 768v-160h-64v160h64z m192-80a48 48 0 0 1-48 48v64a112 112 0 0 0 112-112h-64zM560 640a48 48 0 0 1 48 48h64a112 112 0 0 0-112-112v64zM576 64H256v64h320V64zM192 128v768h64V128H192z m64 832h352v-64H256v64z m-64-64a64 64 0 0 0 64 64v-64H192zM256 64a64 64 0 0 0-64 64h64V64z m512 256a191.712 191.712 0 0 1-80.64 156.448l37.152 52.096A255.712 255.712 0 0 0 832 320h-64z m-192-192a192 192 0 0 1 192 192h64a256 256 0 0 0-256-256v64z m224 576a192 192 0 0 1-192 192v64a256 256 0 0 0 256-256h-64z m-108.064-172.736A192 192 0 0 1 800 704h64a256 256 0 0 0-144.064-230.304l-28 57.568z\" fill=\"#000000\" p-id=\"1963\"></path></svg>"
      //   }, 
      //   "link", "table", "|", "undo", "redo"
      // ],
      // toolbar: [],
      cache: {
        enable: false,
      },
      after: () => {
        if (this.vditor) {
          this.vditor.setValue(content);
        } else {
          console.log("vditor is null");
        }
      },
      input: (value: string) => {
        console.log("input\n", value);
      },
      theme: "dark",
    }
  }

}

// {
//   image: {
//     preview(bom: Element) {
//       console.log(bom);
//     },
//   },
//   // upload: {
//   //   handler(files: File[]) {
//   //     console.log(files);
//   //     return "https://hacpai.com/images/2020/04/1586249606.png";
      
//   //   },
//   // },
//   upload: {
//     accept: 'image/png, image/jpeg',
//     token: 'test',
//     url: '/api/upload/editor',
//     linkToImgUrl: '/api/upload/fetch',
//     filename (name) {
//       return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
//         replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
//         replace('/\\s/g', '')
//     },
//   },
//   lang: "en_US",
//   mode: "ir",
//   // height: 1000,

//   toolbarConfig: {
//     // hide: true,
//     // pin: false,
//   },
//   // name can be enumerated as: emoji, headings, bold, italic, strike, |, line, quote, list, ordered-list, check, outdent, indent, code, inline-code, insert-after, insert-before, undo, redo, upload, link, table, record, edit-mode, both, preview, fullscreen, outline, code-theme, content-theme, export, devtools, info, help, br
//   toolbar: toolbar ? [
//     "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", 
//     "outdent", "indent", "|", "quote", "line", "code", "inline-code", "insert-after",
//     "insert-before", "|", "link", "table", "|", "undo", "redo"
//   ]: [],
//   // toolbar: [ "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", "outdent", "indent",
//   //   "|", "quote", "line", "code", "inline-code", "insert-after", "insert-before", "|", 
//   //   {
//   //     "name": "upload",
//   //     "tipPosition": "n",
//   //     "prefix": "<img src=\"",
//   //     "suffix": "\" alt=\"\" height=\"\" width\"\" />",
//   //     "icon": "<svg viewBox=\"0 0 1024 1024\" width=\"32\" height=\"32\"><path d=\"M0 0h1024v1024H0z\" fill=\"#FFFFFF\" p-id=\"1962\"></path><path d=\"M384 256V224h-32v32h32z m0 160h-32v32h32v-32z m0 192v-32h-32v32h32z m0 160h-32v32h32v-32z m321.92-265.504l-18.56-26.048a32 32 0 0 0 4.576 54.816l13.984-28.8zM384 288h176V224H384v64z m176 96H384v64h176v-64zM416 416V256h-64v160h64z m192-80a48 48 0 0 1-48 48v64a112 112 0 0 0 112-112h-64zM560 288a48 48 0 0 1 48 48h64A112 112 0 0 0 560 224v64zM384 640h176v-64H384v64z m176 96H384v64h176v-64zM416 768v-160h-64v160h64z m192-80a48 48 0 0 1-48 48v64a112 112 0 0 0 112-112h-64zM560 640a48 48 0 0 1 48 48h64a112 112 0 0 0-112-112v64zM576 64H256v64h320V64zM192 128v768h64V128H192z m64 832h352v-64H256v64z m-64-64a64 64 0 0 0 64 64v-64H192zM256 64a64 64 0 0 0-64 64h64V64z m512 256a191.712 191.712 0 0 1-80.64 156.448l37.152 52.096A255.712 255.712 0 0 0 832 320h-64z m-192-192a192 192 0 0 1 192 192h64a256 256 0 0 0-256-256v64z m224 576a192 192 0 0 1-192 192v64a256 256 0 0 0 256-256h-64z m-108.064-172.736A192 192 0 0 1 800 704h64a256 256 0 0 0-144.064-230.304l-28 57.568z\" fill=\"#000000\" p-id=\"1963\"></path></svg>"
//   //   }, 
//   //   "link", "table", "|", "undo", "redo"
//   // ],
//   // toolbar: [],
//   cache: {
//     enable: false,
//   },
//   after: () => {
//     if (this.vditor) {
//       this.vditor.setValue(content);
//     } else {
//       console.log("vditor is null");
//     }
//   },
//   input: (value: string) => {
//     console.log("input\n", value);
//   },
//   theme: "dark",
// }
