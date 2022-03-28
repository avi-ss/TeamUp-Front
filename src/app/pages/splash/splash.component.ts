import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css'],
})
export class SplashComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToLogin(): void {
    console.log('going to login');
    this.router.navigateByUrl('/login');
  }
}
