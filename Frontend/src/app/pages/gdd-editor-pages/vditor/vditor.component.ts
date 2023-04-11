import { Component } from '@angular/core';
import { EditingDocumentService } from 'src/app/services/editing-document.service';
import Vditor from "vditor";
import { ActivatedRoute } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';

@Component({
  selector: 'app-vditor',
  templateUrl: './vditor.component.html',
  styleUrls: ['./vditor.component.scss']
})
export class VditorComponent {

  section: string;
  subSection: string;
  documentSubSection: any;
  vditor: Vditor | null = null;
  showToolbar = false;

  constructor(private activatedRoute: ActivatedRoute, private editingDocumentService: EditingDocumentService ) {}

  toggleToolbar() {
    const content = this.vditor.getValue();
    console.log("content:", content);
    if (this.showToolbar) {
      this.vditor = new Vditor("vditor", this.changeVditorConfig(false, content));
      this.showToolbar = false;
      document.getElementById("toolbar-toggle-button").style.transform = "rotate(-90deg)";
    } else {
      this.vditor = new Vditor("vditor", this.changeVditorConfig(true, content));
      this.showToolbar = true;
      document.getElementById("toolbar-toggle-button").style.transform = "rotate(90deg)";
    }
    // this.vditor.setValue(content);
  }

  updateDocument(value: any) {
    console.log("currentValue: ", value);
    this.documentSubSection.subSectionContent.text = value;
    this.editingDocumentService.updateDocumentSubSection(this.section, this.subSection, this.documentSubSection);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(_value => {
      this.section = _value.section;
      this.subSection = _value.subSection;
      console.log("section:", this.section);
      console.log("subSection:", this.subSection);
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
        this.vditor = new Vditor("vditor", this.changeVditorConfig(false, this.documentSubSection.subSectionContent.text));
      }, 5);
    });
  }


  // Configuracion de vditor

  changeVditorConfig(toolbar: boolean, content: string) : IOptions {
    return {
        value: content,
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
        {
            hotkey: "⌘H",
            icon:
                '<svg><use xlink:href="#vditor-icon-headings"></use></svg>',
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
            icon:
                '<svg><use xlink:href="#vditor-icon-ordered-list"></use></svg>',
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
            icon:
                '<svg><use xlink:href="#vditor-icon-outdent"></use></svg>',
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
            icon:
                '<svg><use xlink:href="#vditor-icon-inline-code"></use></svg>',
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
        //     icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
        //     name: "upload",
        //     tipPosition: "s",
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
            name: "br",
        },
    ]: [],
    //   toolbar: toolbar ? [
    //     "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", 
    //     "outdent", "indent", "|", "quote", "line", "code", "inline-code", "insert-after",
    //     "insert-before", "|", "link", "table", "|", "undo", "redo"
    //   ]: [],
    // toolbar: [ "headings", "bold", "italic", "strike", "|", "list", "ordered-list", "check", "outdent", "indent",
    //   "|", "quote", "line", "code", "inline-code", "insert-after", "insert-before", "|", 
    //   {
    //     "name": "upload",
    //     "tipPosition": "s",
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
    after: () => {},
    input: (value: string) => {
      this.updateDocument(value);
    },
    theme: "dark",
    }
  }
}