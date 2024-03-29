import { Component } from "@angular/core";
import { EditingDocumentService } from "src/app/services/editing-document.service";
import { DocumentService } from "src/app/services/document.service";
import Vditor from "vditor";
import { ActivatedRoute, Router } from "@angular/router";
import { filter, map, take, timeInterval } from "rxjs/operators";
import { TokenService } from "src/app/services/token.service";
import detectUrlChange from "detect-url-change";

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
  showUpload = true;
  localUser = null;
  lastMyUpdate: boolean = true;
  myInput: boolean = false;

  isBlocked: boolean = false;
  isUserEditing: boolean = false;

  decodeToken: any;
  updateSocket: any;
  getParams: any;
  getDocumentId: any;

  updateBlockedInterval: any = null;

  userBlocking = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private editingDocumentService: EditingDocumentService,
    private documentService: DocumentService,
    private tokenService: TokenService
  ) {}

  updateDocument(value: any) {
    this.myInput = true;

    this.documentSubSection.subSectionContent.text = value;
    this.editingDocumentService.updateDocumentSubSection(
      this.section,
      this.subSection,
      this.documentSubSection
    );
  }

  ngOnDestroy() {
    this.vditor.destroy();

    this.editingDocumentService.userEditingByComponent[this.subSection] = null;

    this.decodeToken.unsubscribe();
    this.updateSocket.unsubscribe();
    this.getParams.unsubscribe();
    this.getDocumentId.unsubscribe();
    if (this.updateBlockedInterval) {
      clearInterval(this.updateBlockedInterval);
    }
  }

  ngOnInit() {
    if (this.editingDocumentService.read_only) {
      this.isBlocked = true;
    }

    this.decodeToken = this.tokenService
      .decodeToken()
      .subscribe((data: any) => {
        this.localUser = data.decoded.email;
      });

    this.getParams = this.activatedRoute.data.subscribe((_value) => {
      this.section = _value.section;
      this.subSection = _value.subSection;
      this.showUpload = _value.upload;
    });

    this.getDocumentId = this.activatedRoute.queryParams.subscribe((params) => {
      this.documentId = params.pjt;
    });

    this.updateSocket = this.editingDocumentService
      .updateDocumentSocket()
      .pipe(filter((document) => document.socketSubSection === this.subSection))
      .subscribe((document) => {

        if (this.myInput) {
          this.myInput = false;
          return;
        }

        this.documentSubSection = document.documentContent
          .find((section) => section.sectionTitle === this.section)
          .subSections.find(
            (subsection) => subsection.subSectionTitle === this.subSection
          );

        const userEditing =
          this.editingDocumentService.userEditingByComponent[this.subSection];
        this.isUserEditing =
          userEditing && userEditing?.email !== this.localUser;
        this.isBlocked =
          this.isUserEditing || this.editingDocumentService.read_only;
        if (this.isUserEditing) {
          this.userBlocking = userEditing;
        }

        this.vditor.setValue(this.documentSubSection.subSectionContent.text);
        this.resetCaretToLastPosition(this.lastRow, this.lastCol);
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
      .subscribe((document) => {
        this.documentSubSection = document;

        setTimeout(() => {
          this.vditor = new Vditor(
            "vditor",
            this.changeVditorConfig(
              this.showUpload,
              this.documentSubSection.subSectionContent.text,
              true
            )
          );
          var el = document.getElementsByClassName("vditor-ir")[0];

          el.addEventListener("click", () => {
            this.setCaretCursorPosition();
          });
        });
        this.updateBlockedInterval = setInterval(() => {
          this.updateIsBlocked1s();
        }, 1000);
      });
  }

  updateIsBlocked1s() {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked =
      this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked =
      this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
    if (this.isBlocked) {
      event.preventDefault();
    }
  }
  onContextMenu(event: MouseEvent) {
    const userEditing =
      this.editingDocumentService.userEditingByComponent[this.subSection];
    this.isUserEditing = userEditing && userEditing?.email !== this.localUser;
    this.isBlocked =
      this.isUserEditing || this.editingDocumentService.read_only;
    if (this.isUserEditing) {
      this.userBlocking = userEditing;
    }
    if (this.isBlocked) {
      event.preventDefault();
    }
  }

  lastCol = 0;
  lastRow = 0;

  async scaleImage(file: File): Promise<File> {
    const img = new Image();
    const reader = new FileReader();
    reader.readAsDataURL(file);
    const base64 = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
    });
    return new Promise<File>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: file.lastModified,
            });
            resolve(resizedFile);
          },
          file.type,
          0.8
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = base64;
    });
  }

  hasNonAsciiCharacters(string) {
    const nonAsciiRegex = /[^\x00-\x7F]/;
    return nonAsciiRegex.test(string);
  }

  public async onFileSelected(event: any) {
    let file = event.target.files[0];

    if (file) {
      const fileSize = file.size / (1024 * 1024); // in MB
      if (fileSize > 1) {
        file = await this.scaleImage(file);
      }
      let fixName: string;
      if (this.hasNonAsciiCharacters(file.name)) {
        fixName = Date.now().toString() + "." + file.name.split(".")[1];
      } else {
        fixName = file.name.replace(/ /gi, "_");
      }

      const formData = new FormData();
      formData.append("image", file, fixName);
      this.documentService
        .uploadImage(this.documentId, fixName, formData)
        .subscribe(
          (res) => {},
          (err) => {
            if (err.status === 200) {
              this.vditor.insertValue(
                `![](uploads/${this.documentId}/${fixName})`
              );

              this.updateDocument(this.vditor.getValue());
              this.editingDocumentService.document$
                .pipe(take(1))
                .subscribe((document) => {
                  this.documentService
                    .updateDocument(this.documentId, document)
                    .subscribe((res) => {
                      (err) => {};
                    });
                });
            } else {
            }
          }
        );
    }
  }

  uploadImage() {
    document.getElementById("fileSelector").click();
  }

  changeVditorConfig(
    showUploadTool: boolean,
    content: string,
    showToolBar: boolean
  ): IOptions {
    return {
      value: content,
      placeholder: "Type here...",
      upload: {
        max: 1048576,
        accept: "image/jpeg,image/png,image/gif",

        filename(name) {
          return name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
            .replace("/\\s/g", "");
        },
        success: (editor, result) => {},
      },
      lang: "en_US",
      mode: "ir",
      toolbarConfig: {
        hide: true,
        pin: true,
      },

      toolbar: showToolBar
        ? showUploadTool
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
              {
                icon: '<svg><use xlink:href="#vditor-icon-upload"></use></svg>',
                name: "newUpload",
                tip: "Upload Image",
                tipPosition: "s",
                click() {
                  document.getElementById("fileSelector").click();
                },
              },
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
                name: "br",
              },
            ]
          : [
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
                name: "br",
              },
            ]
        : [],
      cache: {
        enable: false,
      },
      after: () => {
        this.resetCaretToLastPosition(this.lastRow, this.lastCol);
        this.setCaretCursorPosition();
      },
      input: (value: string) => {
        this.setCaretCursorPosition();
        this.myInput = true;
        this.updateDocument(value);
      },
      theme: "dark",
    };
  }

  resetTo0() {
    this.lastCol = 0;
    this.lastRow = 0;
  }

  resetCaretToLastPosition(row: number, col: number) {
    var el = document.getElementsByClassName("vditor-ir")[0];
    el.addEventListener("click", () => {
      this.setCaretCursorPosition();
    });
    let lines = el.children[0];
    var range = document.createRange();
    var sel = window.getSelection();

    range.setStart(lines.children[row].firstChild, col);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
  }

  vditorLinesParent: any;
  selection: any;
  lines: any;

  setCaretCursorPosition() {
    this.selection = document.getSelection();

    this.vditorLinesParent = document.getElementsByClassName("vditor-ir")[0];

    this.lines = this.vditorLinesParent.children[0];

    let row = 0;
    let col = 0;
    let leng = this.lines.children.length;
    for (let i = 0; i < leng; i++) {
      if (this.lines.children[i].contains(this.selection.anchorNode)) {
        row = i;
        col = this.selection.anchorOffset;
        break;
      }
    }

    this.lastCol = col;
    this.lastRow = row;

    this.getMaxColandRow();
  }

  getMaxColandRow() {
    let row = this.lines.children.length;
    let col = 0;

    try {
      col = this.lines.children[row].textContent.length - 1;
    } catch (error) {
      col = 0;
    }

    return { row, col };
  }
}
