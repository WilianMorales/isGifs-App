import { Component, HostListener } from '@angular/core';
import { SideMenuHeaderComponent } from "./side-menu-header/side-menu-header.component";
import { SideMenuOptionsComponent } from "./side-menu-options/side-menu-options.component";

@Component({
  selector: 'gifs-side-menu',
  imports: [SideMenuHeaderComponent, SideMenuOptionsComponent],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedToggleButton = target.closest('#menu-toggle');

    const isMobile = window.innerWidth < 640;

    if (isMobile && this.isSidebarOpen && !clickedToggleButton) {
      this.isSidebarOpen = false;
    }
  }
}
