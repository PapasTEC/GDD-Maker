import { Component } from "@angular/core";

@Component({
  selector: "app-game-genre",
  templateUrl: "./game-genre.component.html",
  styleUrls: ["./game-genre.component.scss", "../setupStyles.scss"],
})
export class GameGenreComponent {
  genreName: string;
  tags: string[] = [];

  constructor() {}

  ngOnInit() {
    if (sessionStorage.getItem("currentSetup") !== null) {
      let currentSetup = JSON.parse(sessionStorage.getItem("currentSetup"));
      this.tags = currentSetup.gameTags;
    }
  }

  public addTag(): void {
    var genreTextBox = document.getElementById("genreText") as HTMLInputElement;

    if (genreTextBox.value == "") {
      return;
    }

    const repeated = this.tags.find((val) => val == genreTextBox.value);

    if (repeated) {
      return;
    }

    this.tags.push(genreTextBox.value);
    genreTextBox.value = "";

    this.updateStorage();
  }

  public deleteTag(id: number): void {
    this.tags.splice(id, 1);

    this.updateStorage();
  }

  updateStorage() {
    let currentSetup = JSON.parse(sessionStorage.getItem("currentSetup"));
    currentSetup.gameTags = this.tags;
    sessionStorage.setItem("currentSetup", JSON.stringify(currentSetup));
  }
}
