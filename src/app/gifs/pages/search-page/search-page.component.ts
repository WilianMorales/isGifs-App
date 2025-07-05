import { GifsService } from '@service/gifs.service';
import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { Gif } from '../../interfaces/gif.interfaces';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  GifsService = inject(GifsService);
  gifs = signal<Gif[]>([]);

  onSearch(query: string): void {
    this.GifsService.searchGifs(query)
      .subscribe((resp) => {
        this.gifs.set(resp)
      })
  }
}
