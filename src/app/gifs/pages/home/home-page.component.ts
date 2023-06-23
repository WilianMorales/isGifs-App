import { Component } from '@angular/core';
import { IGif } from '@interfaces/gifs.interfaces';
import { GifsService } from '@service/gifs.service';


@Component({
  selector: 'gifs-home-page',
  templateUrl: './home-page.component.html'
})
export class HomePageComponent {

  constructor(private gifsService: GifsService) { }

  get gifs() : IGif[] {
    return this.gifsService.gifList;
  }

}
