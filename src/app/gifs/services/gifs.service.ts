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
  trendingGifsLoading = signal(false);
  private trendingGifsPage = signal(0);

  trendingGifGroup = computed<Gif[][]>(() => {
    const groups = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      groups.push(this.trendingGifs().slice(i, i + 3));
    }

    return groups;
  })

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKeys = computed(() => Object.keys(this.searchHistory()).reverse());

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  });

  loadTrendingGifs(): void {

    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: "24",
        offset: this.trendingGifsPage() * 24,
        rating: "gr"
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update(currentGifs => [...currentGifs, ...gifs]);
      this.trendingGifsPage.update(page => page + 1);
      this.trendingGifsLoading.set(false);
    })
  }

  searchGifs(query: string): Observable<Gif[]> {
    const normalizedQuery = query.toLowerCase();

    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: "24",
        q: query,
      }
    }).pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),

      // Historial
      tap(items => {
        this.searchHistory.update(history => {
          const newHistory = { ...history };

          if (!newHistory[normalizedQuery]) {
            const keys = Object.keys(newHistory);

            if (keys.length >= 7) {
              const oldestKey = keys[0]; // orden de inserción
              delete newHistory[oldestKey];
            }
          }

          newHistory[normalizedQuery] = items;

        return newHistory;
        });
      })
    );
  }

  getHistoryGifs(query: string): Gif[] {
    // return this.searchHistory()[query] ?? []; <-- Old way, not recommended

    const key = query.toLowerCase();
    const history = this.searchHistory();
    return Object.prototype.hasOwnProperty.call(history, key)
      ? history[key]
      : [];
  }

  removeSearchHistory(query: string): void {
    const normalizedQuery = query.toLowerCase();

    this.searchHistory.update(history => {
      const newHistory = { ...history };
      delete newHistory[normalizedQuery];
      return newHistory;
    });
  }

}
