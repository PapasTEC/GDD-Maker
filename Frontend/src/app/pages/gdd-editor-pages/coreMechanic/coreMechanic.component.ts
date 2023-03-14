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
  coreMechanicContent: string[] = [
    "El jugador se encuentra en una dimensión **desconocida** que no calza con todo lo real de la que debe escapar.",
    "1. Middle\n\n2.Undeground",
    "1. Full Entertainment for the player\n2. The player can interact with the world",
    "# The Best Game Ever",
  ];

  ngOnInit() {
    (this.vditor1 = new Vditor(
      "vditor1",
      this.changeVditorConfig("Metaphore...", this.coreMechanicContent[0], 0)
    )),
      (this.vditor2 = new Vditor(
        "vditor2",
        this.changeVditorConfig(
          "Progression...",
          this.coreMechanicContent[1],
          1
        )
      ));
    this.vditor3 = new Vditor(
      "vditor3",
      this.changeVditorConfig("Secondary...", this.coreMechanicContent[2], 2)
    );
    this.vditor4 = new Vditor(
      "vditor4",
      this.changeVditorConfig(
        "Core Mechanic...",
        this.coreMechanicContent[3],
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
