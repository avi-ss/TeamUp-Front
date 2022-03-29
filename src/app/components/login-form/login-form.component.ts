import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  hide: boolean = true;

  constructor(private builder: FormBuilder) {
    this.buildLoginForm();
  }

  ngOnInit(): void {}

  private buildLoginForm() {
    this.loginForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
        ],
      ],
    });
  }

  onLogin() {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  getEmailErrorMessage() {
    if (this.loginForm != null) {
      if (this.loginForm.get('email')?.hasError('required')) {
        return 'You must enter an email';
      }

      return this.loginForm.get('email')?.hasError('email')
        ? 'Not a valid email'
        : '';
    }
    return '';
  }

  getPasswordErrorMessage() {
    if (this.loginForm != null) {
      if (this.loginForm.get('password')?.hasError('required')) {
        return 'You must enter a password';
      } else if (
        this.loginForm.get('password')?.hasError('minlength') ||
        this.loginForm.get('password')?.hasError('maxlength')
      ) {
        return 'Password must have between 8 and 25 characters';
      }
    }
    return '';
  }
}
