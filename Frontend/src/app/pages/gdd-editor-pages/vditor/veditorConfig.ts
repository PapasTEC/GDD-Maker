export function changeVditorConfig(toolbar: boolean, content: string, inputFunc: Function) : IOptions {
    return {
        value: content,
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











        {
            name: "br",
        },
    ]: [],

















    cache: {
        enable: false,
    },
    after: () => {},
    input: (value: string) => {

    },
    theme: "dark",
    }
}