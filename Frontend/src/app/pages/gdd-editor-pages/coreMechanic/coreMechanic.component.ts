import { Component } from "@angular/core";
import Vditor from "vditor";

@Component({
  selector: "app-coreMechanic",
  templateUrl: "./coreMechanic.component.html",
  styleUrls: ["./coreMechanic.component.scss"],
})
export class CoreMechanicComponent {
  vditor1: Vditor | null = null;
  vditor2: Vditor | null = null;
  vditor3: Vditor | null = null;
  vditor4: Vditor | null = null;
  coreMechanicContent = {
    coreMechanic: "",
    secondary: "",
    progression: "",
    metaphore: "",
  };

  ngOnInit() {
    (this.vditor1 = new Vditor(
      "vditor1",
      this.changeVditorConfig(
        "Metaphore...",
        this.coreMechanicContent["metaphore"],
        0
      )
    )),
      (this.vditor2 = new Vditor(
        "vditor2",
        this.changeVditorConfig(
          "Progression...",
          this.coreMechanicContent["progression"],
          1
        )
      ));
    this.vditor3 = new Vditor(
      "vditor3",
      this.changeVditorConfig(
        "Secondary...",
        this.coreMechanicContent["secondary"],
        2
      )
    );
    this.vditor4 = new Vditor(
      "vditor4",
      this.changeVditorConfig(
        "Core Mechanic...",
        this.coreMechanicContent["coreMechanic"],
        3
      )
    );
  }

  changeVditorConfig(
    placeholder: string,
    content: string,
    index: number
  ): IOptions {
    return {
      value: content,
      placeholder: placeholder,
      toolbar: [],
      lang: "en_US",
      mode: "ir",
      cache: {
        enable: false,
      },
      after: () => {},
      input: (value: string) => {},
      theme: "dark",
    };
  }
}
