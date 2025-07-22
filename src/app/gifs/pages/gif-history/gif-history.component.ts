import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { GifsService } from '@service/gifs.service';
import { GifListComponent } from "../../components/gif-list/gif-list.component";

@Component({
  selector: 'app-gif-history',
  imports: [GifListComponent],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent {

  private gifService = inject(GifsService);
  private router = inject(Router)

  query = toSignal(
    inject(ActivatedRoute).params
      .pipe(
        map((params) => params['query'] || '')
      )
  );

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()));

  constructor(){

    // Check if the query exists in the history. If not, redirect to the search page
    effect(() => {
      const gifs = this.gifService.getHistoryGifs(this.query());
      if (gifs.length === 0) {
        this.router.navigate(['/dashboard/search']);
      }
    });
  }
}
