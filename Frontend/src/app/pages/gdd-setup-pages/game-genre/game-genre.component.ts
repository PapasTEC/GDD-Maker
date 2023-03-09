import { Component } from '@angular/core';

@Component({
  selector: 'app-game-genre',
  templateUrl: './game-genre.component.html',
  styleUrls: ['./game-genre.component.scss', '../setupStyles.scss']
})
export class GameGenreComponent {

  genreName: string;
  tags: string[] = [];

  public addTag(): void {
    var genreTextBox = document.getElementById("genreText") as HTMLInputElement;

    if(genreTextBox.value == ""){
      return;
    }

    const repeated = this.tags.find( val => val == genreTextBox.value);

    if(repeated){
      return;
    }

    this.tags.push(genreTextBox.value);
    genreTextBox.value = "";

    this.getDataInJSONFormat();
  }

  public deleteTag(id: number): void {
    // Delete at index 
    this.tags.splice(id, 1);
    console.log(this.tags);
  }

  private getDataInJSONFormat(): Object{
    let newJSON = {tags:[]};
    this.tags.forEach(userTag => newJSON.tags.push(userTag));
    console.log(newJSON);
    return newJSON;
  }

  
}
