
import { inject, Injectable, signal,  } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { environment } from "@environments/environment";
import type { GiphyResponse } from "../interfaces/giphy.interfaces";
import { Gif } from "../interfaces/gif.interfaces";
import { GifMapper } from "../mapper/gif.mapper";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class GifsService {

  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal(true);

  constructor() {
    this.loadTrendingGifs();
  }

  loadTrendingGifs() {
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

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: "20",
        q: query,
      }
    }).pipe(
      map( ({ data }) => data ),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items))
    )
  }

}
