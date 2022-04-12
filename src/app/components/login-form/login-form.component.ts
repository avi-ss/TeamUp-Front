import { Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PlayerLogin } from 'src/app/models/PlayerLogin';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LoginFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LoginFormComponent),
      multi: true,
    },
  ],
})
export class LoginFormComponent implements ControlValueAccessor, OnDestroy {
  form: FormGroup = this.builder.group({});
  subscriptions: Subscription[] = [];
  hide: boolean = true;

  constructor(private builder: FormBuilder) {
    this.buildLoginForm();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  writeValue(value: any): void {
    if (value) {
      this.value = value;
    }

    if (value === null) {
      this.form.reset();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // communicate the inner form validation to the parent form
  validate(_: FormControl) {
    return this.form.valid ? null : { profile: { valid: false } };
  }

  private buildLoginForm() {
    this.form = this.builder.group({
      nickname: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(16),
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
        ],
      ],
    });

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  get value(): PlayerLogin {
    const playerLogin: PlayerLogin = {
      nickname: this.form.value.nickname,
      password: this.form.value.password,
    };

    return playerLogin;
  }

  set value(value: PlayerLogin) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  get nickname() {
    return this.form.get('nickname');
  }

  get password() {
    return this.form.get('password');
  }

  onChange: any = () => {};
  onTouched: any = () => {};

  getNicknameErrorMessage() {
    if (this.form != null) {
      if (this.nickname?.hasError('required')) {
        return 'You must enter a nickname';
      } else if (this.nickname?.hasError('minlength')) {
        return 'Minimum of 5 characters';
      } else if (this.nickname?.hasError('maxlenght')) {
        return 'Maximum of 16 characters';
      }
    }
    return '';
  }

  getPasswordErrorMessage() {
    if (this.form != null) {
      if (this.form.get('password')?.hasError('required')) {
        return 'You must enter a password';
      } else if (
        this.form.get('password')?.hasError('minlength') ||
        this.form.get('password')?.hasError('maxlength')
      ) {
        return 'Password must have between 8 and 25 characters';
      }
    }
    return '';
  }
}
