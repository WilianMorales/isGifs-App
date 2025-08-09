import { GifsService } from '@service/gifs.service';
import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
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
  hasSearched = signal(false);

  @ViewChild('txtSearch') txtSearchInput!: ElementRef<HTMLInputElement>;

  onSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    this.GifsService.searchGifs(trimmedQuery)
      .subscribe((resp) => {
        this.gifs.set(resp);
        this.hasSearched.set(true);
        this.txtSearchInput.nativeElement.value = '';
      })
  }
}
