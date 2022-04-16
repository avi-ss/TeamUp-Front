import { BreakpointObserver } from '@angular/cdk/layout';
import {
  AfterViewChecked,
  Component,
  ContentChild,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  isOpen: boolean = false;
  isOver: boolean = true;

  width: number = 30;
  contentPaddingLeft: number = 32;

  // Declaring the Promise, yes! Promise!
  dataLoaded: Promise<boolean>;

  constructor(private observer: BreakpointObserver) {
    if (window.innerWidth < 800) {
      this.width = 70;
      this.contentPaddingLeft = 0;
      this.isOpen = false;
      this.isOver = true;
    } else {
      this.width = 30;
      this.contentPaddingLeft = 32;
      this.isOpen = true;
      this.isOver = false;
    }
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      this.dataLoaded = Promise.resolve(true);

      if (res.matches) {
        this.isOver = true;
        this.isOpen = false;

        this.width = 70;
        this.contentPaddingLeft = 0;
      } else {
        this.isOver = false;
        this.isOpen = true;

        this.width = 30;
        this.contentPaddingLeft = 32;
      }
    });
  }

  toggleSidenav(): void {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.isOpen = false;
      } else {
        return;
      }
    });
  }
}
