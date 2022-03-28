import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  email: string = '';
  password: string = '';

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    if (!this.email) {
      alert('Email cant be empty');
      return;
    }
  }
}
