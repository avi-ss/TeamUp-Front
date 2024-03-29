import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/Player';
import { Preferences } from 'src/app/models/Preferences';
import { PlayerService } from 'src/app/services/player.service';
import { Router } from '@angular/router';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true } },
  ],
})
export class RegisterComponent {
  registerForm: FormGroup[] = [];

  constructor(
    private playerService: PlayerService,
    private builder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm.push(
      this.builder.group({
        account: [],
      })
    );
    this.registerForm.push(
      this.builder.group({
        basic: [],
      })
    );
    this.registerForm.push(
      this.builder.group({
        preferences: [],
      })
    );
  }

  onRegister() {
    const preferences: Preferences = {
      game: this.game,
      rank: this.rank,
      role: this.role,
      feminine: false,
      wantedUser: 'player',
    };

    const player: Player = {
      nickname: this.nickname,
      email: this.email,
      password: this.password,
      fullname: this.fullname,
      birthday: this.birthday,
      gender: this.gender,
      preferences: preferences,
    };

    console.log(player);

    this.playerService.addPlayer(player).subscribe(
      (result) => {
        console.log(result);
        this.snackBar.open('Register successful!', 'Dismiss', {
          duration: 2000,
        });
        this.router.navigateByUrl('/login');
      },
      (error) => {
        console.log('ERROR: ' + error);
        this.snackBar.open('Something went wrong...', 'Dismiss', {
          duration: 2000,
        });
      }
    );
  }

  get nickname() {
    return this.registerForm[0].value.account.nickname;
  }

  get email() {
    return this.registerForm[0].value.account.email;
  }

  get password() {
    return this.registerForm[0].value.account.password;
  }

  get fullname() {
    return this.registerForm[1].value.basic.fullname;
  }

  get birthday() {
    return this.registerForm[1].value.basic.birthday;
  }

  get gender() {
    return this.registerForm[1].value.basic.gender;
  }

  get game() {
    return this.registerForm[2].value.preferences.game;
  }

  get role() {
    return this.registerForm[2].value.preferences.role;
  }

  get rank() {
    return this.registerForm[2].value.preferences.rank;
  }
}
