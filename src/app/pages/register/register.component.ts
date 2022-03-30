import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/Player';
import { Preferences } from 'src/app/models/Preferences';
import { Game } from 'src/app/models/Game';
import { GameService } from 'src/app/services/game/game.service';
import { PlayerService } from 'src/app/services/player/player.service';
import { Gender } from 'src/app/models/Gender';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup[] = [];

  hide: boolean = true;
  step: number = 0;
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
          ],
          email: ['', [Validators.required, Validators.email]],
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

  nextStep(): void {
    if (this.step == 0 && this.getNicknameDuplicateErrorMessage()) {
      return;
    }

    if (this.step < this.maxSteps) {
      this.step += 1;
    }
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

  get role() {
    return this.registerForm[5].get('role');
  }

  get rank() {
    return this.registerForm[6].get('rank');
  }

  getNicknameErrorMessage() {
    if (this.registerForm != null) {
      if (this.nickname?.hasError('required')) {
        this.nicknameErrorMessage = 'You must enter a nickname';
        return true;
      } else if (
        this.nickname?.hasError('minlength') ||
        this.nickname?.hasError('maxlength')
      ) {
        this.nicknameErrorMessage =
          'Nickname must have between 5 and 16 characters';
        return true;
      }
    }
    this.nicknameErrorMessage = '';
    return false;
  }

  getNicknameDuplicateErrorMessage() {
    this.playerService
      .getPlayerByNickname(this.nickname?.value)
      .subscribe((player) => {
        console.log(player);
        if (player != null) {
          this.nicknameErrorMessage = 'Nickname is already in use';
          return true;
        }
        this.nicknameErrorMessage = '';
        return false;
      });
    return false;
  }

  getEmailErrorMessage() {
    if (this.registerForm != null) {
      if (this.email?.hasError('required')) {
        return 'You must enter an email';
      } else if (this.email?.hasError('email')) {
        return 'Not a valid email';
      } else {
        /*this.playerService
          .getPlayerByEmail(this.email?.value)
          .subscribe((player) => {
            if (player != null) {
              return 'Email is already in use';
            }
            return '';
          });*/
      }
    }
    return '';
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
