import { Component } from '@angular/core';

@Component({
  selector: 'app-game-genre',
  templateUrl: './game-genre.component.html',
  styleUrls: ['./game-genre.component.scss', '../setupStyles.scss']
})
export class GameGenreComponent {

  genreName: string;
  genres: string[] = [];

  addGenre() {
    var genreTextBox = document.getElementById("genreText") as HTMLInputElement;

    if(genreTextBox.value == ""){
      return;
    }

    const repeated = this.genres.find( val => val == genreTextBox.value);

    if(repeated){
      return;
    }

    this.genres.push(genreTextBox.value);
    genreTextBox.value = "";
  }

  deleteGenre(id: number) {
    // Delete at index 
    this.genres.splice(id, 1);
  }
}
