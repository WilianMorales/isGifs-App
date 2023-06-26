import { Component, Input, OnInit } from '@angular/core';
import { IGif } from '@interfaces/gifs.interfaces';

@Component({
  selector: 'gifs-card',
  templateUrl: './card.component.html'
})
export class CardComponent implements OnInit {
  
  @Input()
  public gif! : IGif;
  
  ngOnInit(): void {
    if( !this.gif ) throw new Error('Gif property iis required.');
  }
}
