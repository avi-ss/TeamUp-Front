import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/Player';
import { Preferences } from 'src/app/models/Preferences';
import { PlayerService } from 'src/app/services/player/player.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup[] = [];

  constructor(
    private playerService: PlayerService,
    private builder: FormBuilder,
    private router: Router
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

    this.playerService.addPlayer(player).subscribe((result) => {
      console.log(result);
      this.router.navigateByUrl('/main/player/' + `${result}`);
    });
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
