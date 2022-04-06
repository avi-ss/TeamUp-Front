import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Player } from 'src/app/models/Player';
import { Preferences } from 'src/app/models/Preferences';
import { Game } from 'src/app/models/Game';
import { GameService } from 'src/app/services/game/game.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { Gender } from 'src/app/models/Gender';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup[] = [];

  hide: boolean = true;
  loaded: boolean = false;
  maxSteps: number = 6;
  games: Game[] = [];
  genders: Gender[] = [
    { name: 'Masculine', value: 'masc' },
    { name: 'Feminine', value: 'fem' },
    { name: 'Other', value: 'other' },
  ];
  maxDate: Date = new Date();
  gameIndex: number = 0;

  nicknameErrorMessage: string = '';
  emailErrorMessage: string = '';

  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
    private builder: FormBuilder,
    private router: Router
  ) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 16);
    this.maxDate = currentDate;

    this.buildRegisterForm();
  }

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.games = games;
      console.log(games);
      this.loaded = true;
    });
  }

  private buildRegisterForm() {
    this.registerForm = [];

    // STEP 0
    this.registerForm.push(
      this.builder.group(
        {
          nickname: [
            '',
            [
              Validators.required,
              Validators.minLength(5),
              Validators.maxLength(16),
            ],
            [this.nicknameValidator()],
          ],
          email: [
            '',
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
          confirmPassword: ['', [Validators.required]],
        },
        {
          // Confirm the passwords
          validators: this.mustMatch('password', 'confirmPassword'),
        }
      )
    );

    // STEP 1
    this.registerForm.push(
      this.builder.group({
        fullname: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(25),
            Validators.pattern('^[A-Z][a-z]*(\\s[A-Z][a-z]*)?'),
          ],
        ],
      })
    );

    // STEP 2
    this.registerForm.push(
      this.builder.group({
        birthday: ['', [Validators.required]],
      })
    );

    // STEP 3
    this.registerForm.push(
      this.builder.group({
        gender: ['', [Validators.required]],
      })
    );

    // STEP 4
    this.registerForm.push(
      this.builder.group({
        game: ['', [Validators.required]],
      })
    );

    // STEP 5
    this.registerForm.push(
      this.builder.group({
        role: ['', [Validators.required]],
      })
    );

    // STEP 6
    this.registerForm.push(
      this.builder.group({
        rank: ['', [Validators.required]],
      })
    );
  }

  onRegister() {
    const preferences: Preferences = {
      game: this.games[this.game?.value].name,
      rank: this.rank?.value,
      role: this.role?.value,
      feminine: false,
    };

    console.log(preferences);

    const player: Player = {
      nickname: this.nickname?.value,
      email: this.email?.value,
      password: this.password?.value,
      fullname: this.fullname?.value,
      birthday: this.birthday?.value,
      gender: this.gender?.value,
      preferences: preferences,
    };

    console.log(player);

    this.playerService.addPlayer(player).subscribe((result) => {
      console.log(result);
      this.router.navigateByUrl('/main/player/' + `${result}`);
    });
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
    return this.registerForm[0].get('nickname');
  }

  get email() {
    return this.registerForm[0].get('email');
  }

  get password() {
    return this.registerForm[0].get('password');
  }

  get confirmPassword() {
    return this.registerForm[0].get('confirmPassword');
  }

  get fullname() {
    return this.registerForm[1].get('fullname');
  }

  get birthday() {
    return this.registerForm[2].get('birthday');
  }

  get gender() {
    return this.registerForm[3].get('gender');
  }

  get game() {
    return this.registerForm[4].get('game');
  }

  get gameName() {
    return this.games[Number(this.game)].name;
  }

  get role() {
    return this.registerForm[5].get('role');
  }

  get roles() {
    return this.games[Number(this.game)].roles;
  }

  get rank() {
    return this.registerForm[6].get('rank');
  }

  get ranks() {
    return this.games[Number(this.game)].ranks;
  }

  getNicknameErrorMessage() {
    if (this.registerForm != null) {
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

  private nicknameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.playerService
        .checkPlayerWithNickname(control.value)
        .pipe(
          map((response: boolean) => (response ? { nicknameUsed: true } : null))
        );
  }

  getEmailErrorMessage() {
    if (this.registerForm != null) {
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

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.playerService
        .checkPlayerWithEmail(control.value)
        .pipe(
          map((response: boolean) => (response ? { emailUsed: true } : null))
        );
  }

  getPasswordErrorMessage() {
    if (this.registerForm != null) {
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
    if (this.registerForm != null) {
      if (this.confirmPassword?.hasError('required')) {
        return 'You must confirm the password';
      } else if (this.confirmPassword?.hasError('mustMatch')) {
        return 'Password does not match';
      }
    }
    return '';
  }
}
