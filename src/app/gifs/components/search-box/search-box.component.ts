import { Component, ElementRef, ViewChild } from '@angular/core';
import { GifsService } from '@service/gifs.service';


@Component({
    selector: 'gifs-search-box',
    template: `
    <div class="form-container">
      <div class="form-tab">
        
        <div class="search-field">
          <img class="search-icon" src="assets/images/search.svg" alt="search">
   
            <input 
              autocomplete="off" 
              type="text"
              class="text-field"
              placeholder="Buscar gifs..."
              (keyup.enter)="searchTag()" 
              #txtTagInput>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./search-box.component.css'],
    standalone: false
})
export class SearchBoxComponent {

  @ViewChild('txtTagInput')
  public tagInput!: ElementRef<HTMLInputElement>;

  constructor(private gifsService: GifsService) { }

  searchTag() {
    const newTag = this.tagInput.nativeElement.value;

    this.gifsService.searchTag(newTag);

    this.tagInput.nativeElement.value = '';

  }

}
