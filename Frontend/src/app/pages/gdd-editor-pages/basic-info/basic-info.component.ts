import { Component } from "@angular/core";
@Component({
  selector: "app-basic-info",
  templateUrl: "./basic-info.component.html",
  styleUrls: [
    "./basic-info.component.scss",
    "../editorGlobalStyles.scss",
    "../vditor/vditor.component.scss",
    "../high_level_design/coreMechanic/coreMechanic.component.scss",
  ],
})
export class BasicInfoComponent {
  elevatorPitch = "";
  slogan = "";
  genreName: string;
  genres: string[] = [];

  tagName: string;
  tags: string[] = [];

  public addGenre(): void {
    var genreTextBox = document.getElementById("genreText") as HTMLInputElement;
    if (genreTextBox.value == "") {
      return;
    }
    const repeated = this.genres.find((val) => val == genreTextBox.value);
    if (repeated) {
      return;
    }
    this.genres.push(genreTextBox.value);
    genreTextBox.value = "";
    console.log("genres:", this.genres);
    //this.updateStorage();
  }
  public deleteGenre(id: number): void {
    // Delete at index
    this.genres.splice(id, 1);
    console.log(this.genres);
    //this.updateStorage();
  }

  public addTag(): void {
    var tagTextBox = document.getElementById("tagText") as HTMLInputElement;
    if (tagTextBox.value == "") {
      return;
    }
    const repeated = this.tags.find((val) => val == tagTextBox.value);
    if (repeated) {
      return;
    }
    this.tags.push(tagTextBox.value);
    tagTextBox.value = "";
    console.log("tags:", this.tags);
    //this.updateStorage();
  }
  public deleteTag(id: number): void {
    // Delete at index
    this.tags.splice(id, 1);
    console.log(this.tags);
    //this.updateStorage();
  }
}
