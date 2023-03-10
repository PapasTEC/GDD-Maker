import { Component } from '@angular/core';

@Component({
  selector: 'app-main-aesthetic',
  templateUrl: './main-aesthetic.component.html',
  styleUrls: ['./main-aesthetic.component.scss', '../setupStyles.scss']
})
export class MainAestheticComponent {
  game_aesthetics = [{"name": "Sensation", "img": "https://www.freepnglogos.com/uploads/sword-png/skyforge-steel-sword-skyrim-wiki-0.png"}, {"name": "Fantasy", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Narrative", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Challenge", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Puzzle", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Fellowship", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Discovery", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Expression", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}, {"name": "Submission", "img": "../../assets/img/aestheticsIcons/jigsaw.jpg"}];
}
