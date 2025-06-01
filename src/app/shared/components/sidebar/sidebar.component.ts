import { Component } from '@angular/core';
import { GifsService } from '@service/gifs.service';

@Component({
    selector: 'shared-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    standalone: false
})
export class SidebarComponent{

  constructor(private gifsService: GifsService) { }

  get tags() {
    return this.gifsService.tagsHistory;
  }

  searchTag(tag : string) {
    return this.gifsService.searchTag(tag);
  }
  

}
