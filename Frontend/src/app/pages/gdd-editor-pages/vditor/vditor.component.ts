import { Component } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { DocumentService } from "src/app/services/document.service";
import Vditor from "vditor";
import { ActivatedRoute } from "@angular/router";
import { filter, map, take } from "rxjs/operators";
//import { Buffer } from '../../../../../../Backend/uploads/234/1681252566007-1274551.jpg';
//import { HttpClient } from '@angular/common/http';

@Component({
  selector: "app-vditor",
  templateUrl: "./vditor.component.html",
  styleUrls: ["./vditor.component.scss"],
})
export class VditorComponent {
  documentId: string;
  section: string;
  subSection: string;
  documentSubSection: any;
  vditor: Vditor | null = null;
  showToolbar = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private editingDocumentService: EditingDocumentService,
    private documentService: DocumentService
  ) {}

  toggleToolbar() {
    const content = this.vditor.getValue();
    console.log("content:", content);
    if (this.showToolbar) {
      this.vditor = new Vditor(
        "vditor",
        this.changeVditorConfig(false, content)
      );
      document.getElementById("toolbar-toggle-button").style.transform =
        "rotate(-90deg)";
    } else {
      this.vditor = new Vditor(
        "vditor",
        this.changeVditorConfig(true, content)
      );
      this.showToolbar = true;
      document.getElementById("toolbar-toggle-button").style.transform =
        "rotate(90deg)";
    }
    // this.vditor.setValue(content);
  }

  updateDocument(value: any) {
    console.log("currentValue: ", value);
    this.documentSubSection.subSectionContent.text = value;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((_value) => {
      this.section = _value.section;
      this.subSection = _value.subSection;
      console.log("section:", this.section);
      console.log("subSection:", this.subSection);
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.documentId = params.pjt;
    });

    this.editingDocumentService.document$.pipe(
      filter(document => document !== null),
      map(document => document.documentContent.find(section => 
        section.sectionTitle === this.section).subSections.find(subsection => 
          subsection.subSectionTitle === this.subSection)),
      take(1)
    ).subscribe((document) => {
      this.documentSubSection = document;
      console.log("documentSub:", this.documentSubSection);
      setTimeout(() => {
        this.vditor = new Vditor("vditor", this.changeVditorConfig(true, this.documentSubSection.subSectionContent.text));
        this.vditor.insertValue("![]()");
        this.vditor.setValue(this.documentSubSection.subSectionContent.text);
      }, 5);
    });
  }

  // Funciones para subir imagenes


  public async onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      const fixName = file.name.replace(/ /gi, "_");
      //console.log("name: ", file.name);
      //console.log("fixName: ", fixName);
      // const editName = name.replace(/[^a-z0-9]/gi, "_");
      const fileSize = file.size / 1024 / 1024; // in MB
      //console.log("File size: " + fileSize);

      // alert("File size: " + fileSize);
      // if (fileSize > 1) {
      //   alert("File size exceeds 1 MB");
      //   return;
      // }
      const formData = new FormData();
      formData.append('image', file, fixName);
      //console.log("formData: ", formData);
      this.documentService.uploadImage(this.documentId, formData).subscribe((res) => { }, (err) => {
        if (err.status === 200) {
        this.vditor.insertValue(`![](uploads/${this.documentId}/${fixName})`);

        this.updateDocument(this.vditor.getValue());
        this.editingDocumentService.document$.pipe(
          take(1)
        ).subscribe((document) => {
          
          console.log("document: ", document);
          //this.document.frontPage.lastUpdated = new Date();
          this.documentService.updateDocument(this.documentId, document).subscribe(
            res => {
              console.log("Update res: ", res);
              err => {
                console.log("Update err: ", err);

              }
            });

        });
        } else {
          console.log("Error: ", err);
        }
        
      });
      // console.log("res: ", res);

      // this.uploadedImage = URL.createObjectURL(file);
      // this.vditor.insertValue(`![](${this.uploadedImage})`);
      // const width = prompt("Width", "640");
      // const height = prompt("Height", "480");
      // const scaledBase64 = await this.scaleAndEncodeImage(this.uploadedImage, width, height);
      // const base65 = await this.Base64ToBlob(scaledBase64);
      // const buffer = Buffer.from(scaledBase64.substring(scaledBase64.indexOf(',') + 1), 'base64');
      // console.log("Byte length: " + buffer.length);
      // console.log("MB: " + buffer.length / 1e+6);
      // console.log("uploadedImage: ", this.uploadedImage);
      // this.vditor.insertValue(`![](${URL.createObjectURL(base65)})`);
    }
  }

  async Base64ToBlob(base64: string): Promise<Blob> {
    const res = await fetch(base64);
    const blob = await res.blob();
    return blob;
  }

  async scaleAndEncodeImage(url: any, width: any, height: any): Promise<string> {
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(await fetch(url).then(r => r.blob()));
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = width * img.height / img.width;
        const ctx = canvas.getContext('2d');
        // ctx.drawImage(img, 0, 0, width, height);
        // ctx.drawImage(img, 0, 0, height, height * img.height / img.width);
        ctx.drawImage(img, 0, 0, width, width * img.height / img.width);
        // ctx.drawImage(img, 0, 0, width * img.width / img.height, width);
        // context.drawImage(imageObj, 0, 0, 100, 100 * imageObj.height / imageObj.width)
        const scaledBase64 = canvas.toDataURL();
        console.log("img: ", img.width, img.height);
        console.log("scaledBase64: ", canvas.width, canvas.height);
        resolve(scaledBase64);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64;
    });
  }


  uploadImage() {
    document.getElementById("fileSelector").click();
    // return "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png";
  }

  // Configuracion de vditor

  changeVditorConfig(toolbar: boolean, content: string): IOptions {
    return {
      value: content,
      placeholder: "Type here...",
      // image: {
      //   preview(bom: Element) {
      //     console.log(bom);
      //   },
      // },
      // ![](https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg)
      // upload: {
      //   handler(files: File[]) {
      //     console.log(files);
      //     return "https://hacpai.com/images/2020/04/1586249606.png";
      //   },
      // },
      upload: {
        max: 1048576,
        accept: 'image/jpeg,image/png,image/gif',
        // url: "/api/upload/editor",
        // linkToImgUrl: "/api/upload/fetch",
        filename(name) {
          return name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
            .replace("/\\s/g", "");
        },
        success: (editor, result) => {
          console.log(result);
        }
      },
      lang: "en_US",
      mode: "ir",
      toolbarConfig: {
        hide: true,
        pin: true,
      },
      // name can be enumerated as: emoji, headings, bold, italic, strike, |, line, quote, list, ordered-list, check, outdent, indent, code, inline-code, insert-after, insert-before, undo, redo, upload, link, table, record, edit-mode, both, preview, fullscreen, outline, code-theme, content-theme, export, devtools, info, help, br
      toolbar: toolbar
        ? [
          {
            hotkey: "⌘H",
            icon: '<svg><use xlink:href="#vditor-icon-headings"></use></svg>',
            name: "headings",
            tipPosition: "se",
          },
          {
            hotkey: "⌘B",
            icon: '<svg><use xlink:href="#vditor-icon-bold"></use></svg>',
            name: "bold",
            prefix: "**",
            suffix: "**",
            tipPosition: "se",
          },
          {
            hotkey: "⌘I",
            icon: '<svg><use xlink:href="#vditor-icon-italic"></use></svg>',
            name: "italic",
            prefix: "*",
            suffix: "*",
            tipPosition: "se",
          },
          {
            hotkey: "⌘D",
            icon: '<svg><use xlink:href="#vditor-icon-strike"></use></svg>',
            name: "strike",
            prefix: "~~",
            suffix: "~~",
            tipPosition: "se",
          },

          {
            name: "|",
          },

          {
            hotkey: "⌘L",
            icon: '<svg><use xlink:href="#vditor-icon-list"></use></svg>',
            name: "list",
            prefix: "* ",
            tipPosition: "s",
          },
          {
            hotkey: "⌘O",
            icon: '<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',
            name: "ordered-list",
            prefix: "1. ",
            tipPosition: "s",
          },
          {
            hotkey: "⌘J",
            icon: '<svg><use xlink:href="#vditor-icon-check"></use></svg>',
            name: "check",
            prefix: "* [ ] ",
            tipPosition: "s",
          },
          {
            hotkey: "⇧⌘I",
            icon: '<svg><use xlink:href="#vditor-icon-outdent"></use></svg>',
            name: "outdent",
            tipPosition: "s",
          },
          {
            hotkey: "⇧⌘O",
            icon: '<svg><use xlink:href="#vditor-icon-indent"></use></svg>',
            name: "indent",
            tipPosition: "s",
          },

          {
            name: "|",
          },

          {
            hotkey: "⌘;",
            icon: '<svg><use xlink:href="#vditor-icon-quote"></use></svg>',
            name: "quote",
            prefix: "> ",
            tipPosition: "s",
          },
          {
            hotkey: "⇧⌘H",
            icon: '<svg><use xlink:href="#vditor-icon-line"></use></svg>',
            name: "line",
            prefix: "---",
            tipPosition: "s",
          },
          {
            hotkey: "⌘U",
            icon: '<svg><use xlink:href="#vditor-icon-code"></use></svg>',
            name: "code",
            prefix: "```",
            suffix: "\n```",
            tipPosition: "s",
          },
          {
            hotkey: "⌘G",
            icon: '<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',
            name: "inline-code",
            prefix: "`",
            suffix: "`",
            tipPosition: "s",
          },
          {
            hotkey: "⇧⌘B",
            icon: '<svg><use xlink:href="#vditor-icon-before"></use></svg>',
            name: "insert-before",
            tipPosition: "s",
          },
          {
            hotkey: "⇧⌘E",
            icon: '<svg><use xlink:href="#vditor-icon-after"></use></svg>',
            name: "insert-after",
            tipPosition: "s",
          },

          {
            name: "|",
          },

          {
            hotkey: "⌘K",
            icon: '<svg><use xlink:href="#vditor-icon-link"></use></svg>',
            name: "link",
            prefix: "[",
            suffix: "](https://)",
            tipPosition: "s",
          },
          // {
          //   icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
          //   name: "upload",
          //   tipPosition: "s",
          // },
          {
            icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
            name: "newUpload",
            tip: "Upload Image",
            tipPosition: "s",
              click () {
              console.log("Hola")
              document.getElementById("fileSelector").click();
            }
          },
          // {
          //   hotkey: "",
          //   icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
          //   name: "italic",
          //   tip: "Upload Image",
          //   prefix: "![",
          //   suffix: "](" + this.uploadImage() + ")",
          //   tipPosition: "s",
          // },
          {
            hotkey: "⌘M",
            icon: '<svg><use xlink:href="#vditor-icon-table"></use></svg>',
            name: "table",
            prefix: "| col1",
            suffix:
              " | col2 | col3 |\n| --- | --- | --- |\n|  |  |  |\n|  |  |  |",
            tipPosition: "s",
          },
          {
            name: "|",
          },
          {
            hotkey: "⌘Z",
            icon: '<svg><use xlink:href="#vditor-icon-undo"></use></svg>',
            name: "undo",
            tipPosition: "sw",
          },
          {
            hotkey: "⌘Y",
            icon: '<svg><use xlink:href="#vditor-icon-redo"></use></svg>',
            name: "redo",
            tipPosition: "sw",
          },
          {
            name: "|",
          },
          // {
          //     icon: '<svg><use xlink:href="#vditor-icon-theme"></use></svg>',
          //     name: "content-theme",
          //     tipPosition: "sw",
          // },
          // {
          //     icon:
          //         '<svg><use xlink:href="#vditor-icon-code-theme"></use></svg>',
          //     name: "code-theme",
          //     tipPosition: "sw",
          // },
          {
            icon: '<svg><use xlink:href="#vditor-icon-bug"></use></svg>',
            name: "devtools",
            tipPosition: "nw",
          },
          {
            icon: '<svg><use xlink:href="#vditor-icon-edit"></use></svg>',
            name: "edit-mode",
            tipPosition: "nw",
          },
          // {
          //   icon: '<svg><use xlink:href="#vditor-icon-bug"></use></svg>',
          //   name: "getMarkdown",
          //   tip: "Print Markdown",
          //   tipPosition: "s",
          //   click () {
          //     const markdown = this.vditor.VditorIRDOM2Md(this.vditor.ir.element.innerHTML);
          //     console.log("Makrdown: ", markdown)
          //   }
          // },
          {
            name: "br",
          },
        ]
        : [],
      cache: {
        enable: false,
      },
      after: () => {},
      input: (value: string) => {
        this.updateDocument(value);
      },
      theme: "dark",
    };
  }
}
