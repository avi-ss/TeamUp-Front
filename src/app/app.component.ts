import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(MatSidenav)
  sidenav: MatSidenav;

  width: number = 30;
  contentPaddingLeft: number = 32;

  constructor(private observer: BreakpointObserver) {}

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();

        this.width = 70;
        this.contentPaddingLeft = 0;
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();

        this.width = 30;
        this.contentPaddingLeft = 32;
      }
    });
  }

  toggleSidenav(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.close();
      } else {
        return;
      }
    });
  }
}
