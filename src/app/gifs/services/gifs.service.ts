import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";

import { environment } from "@environments/environment";
import { Gif } from "../interfaces/gif.interfaces";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { GifMapper } from "../mapper/gif.mapper";

const GIF_KEY = 'gifsHistory';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '{}';
  const gifs = JSON.parse(gifsFromLocalStorage) as Record<string, Gif[]>;
  return gifs;
}

@Injectable({ providedIn: 'root' })
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs(): void {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: "20",
        rating: "g"
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
    })
  }

  searchGifs(query: string): Observable<Gif[]> {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: "20",
        q: query,
      }
    }).pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      // Historial
      tap(items => {
        this.searchHistory.update(history => ({
          ...history,
          [query.toLowerCase()]: items,
        }))
      })
    )
  }

  getHistoryGifs(query: string): Gif[] {
    // return this.searchHistory()[query] ?? []; <-- Old way, not recommended

    const key = query.toLowerCase();
    const history = this.searchHistory();
    return Object.prototype.hasOwnProperty.call(history, key)
      ? history[key]
      : [];
  }

}
