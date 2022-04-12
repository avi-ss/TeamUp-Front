import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
  ValidationErrors,
  AbstractControl,
  NG_VALIDATORS,
  FormControl,
} from '@angular/forms';
import { Observable, map, Subscription } from 'rxjs';
import { PlayerService } from 'src/app/services/player.service';
import { AccountInfoData } from 'src/app/models/AccountInformation';

@Component({
  selector: 'app-account-form',
  templateUrl: './account-form.component.html',
  styleUrls: ['./account-form.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccountFormComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AccountFormComponent),
      multi: true,
    },
  ],
})
export class AccountFormComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input() data: AccountInfoData = {
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  form: FormGroup = this.builder.group({});
  subscriptions: Subscription[] = [];
  nicknameErrorMessage: string = '';
  emailErrorMessage: string = '';
  hide: boolean = true;

  get value(): AccountInfoData {
    return this.form.value;
  }

  set value(value: AccountInfoData) {
    this.form.setValue(value);
    this.onChange(value);
    this.onTouched();
  }

  constructor(
    private builder: FormBuilder,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group(
      {
        nickname: [
          this.data.nickname,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(16),
          ],
          [this.nicknameValidator()],
        ],
        email: [
          this.data.email,
          [Validators.required, Validators.email],
          [this.emailValidator()],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(25),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.mustMatch('password', 'confirmPassword'),
      }
    );

    this.subscriptions.push(
      // any time the inner form changes update the parent of any change
      this.form.valueChanges.subscribe((value) => {
        this.onChange(value);
        this.onTouched();
      })
    );
  }

  onChange: any = () => {};
  onTouched: any = () => {};

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

  private nicknameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.playerService
        .checkPlayerWithNickname(control.value)
        .pipe(
          map((response: boolean) => (response ? { nicknameUsed: true } : null))
        );
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.playerService
        .checkPlayerWithEmail(control.value)
        .pipe(
          map((response: boolean) => (response ? { emailUsed: true } : null))
        );
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (form: FormGroup) => {
      const control = form.controls[controlName];
      const matchingControl = form.controls[matchingControlName];
      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  get nickname() {
    return this.form.get('nickname');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  getNicknameErrorMessage() {
    if (this.form != null) {
      if (this.nickname?.hasError('required')) {
        this.nicknameErrorMessage = 'You must enter a nickname';
        return true;
      } else if (this.nickname?.hasError('minlength')) {
        this.nicknameErrorMessage = 'Minimum of 5 characters';
        return true;
      } else if (this.nickname?.hasError('maxlenght')) {
        this.nicknameErrorMessage = 'Maximum of 16 characters';
        return true;
      } else if (this.nickname?.hasError('nicknameUsed')) {
        this.nicknameErrorMessage = 'Nickname already in use';
        return true;
      }
    }
    this.nicknameErrorMessage = '';
    return false;
  }

  getEmailErrorMessage() {
    if (this.form != null) {
      if (this.email?.hasError('required')) {
        this.emailErrorMessage = 'You must enter an email';
        return true;
      } else if (this.email?.hasError('email')) {
        this.emailErrorMessage = 'Not a valid email';
        return true;
      } else if (this.email?.hasError('emailUsed')) {
        this.emailErrorMessage = 'Email already in use';
        return true;
      }
    }
    this.emailErrorMessage = '';
    return false;
  }

  getPasswordErrorMessage() {
    if (this.form != null) {
      if (this.password?.hasError('required')) {
        return 'You must enter a password';
      } else if (
        this.password?.hasError('minlength') ||
        this.password?.hasError('maxlength')
      ) {
        return 'Password must have between 8 and 25 characters';
      }
    }
    return '';
  }

  getConfirmPasswordErrorMessage() {
    if (this.form != null) {
      if (this.confirmPassword?.hasError('required')) {
        return 'You must confirm the password';
      } else if (this.confirmPassword?.hasError('mustMatch')) {
        return 'Password does not match';
      }
    }
    return '';
  }
}
