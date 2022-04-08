import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/Player';
import { Preferences } from 'src/app/models/Preferences';
import { Game } from 'src/app/models/Game';
import { PlayerService } from 'src/app/services/player/player.service';
import { Gender } from 'src/app/models/Gender';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private playerService: PlayerService,
    private builder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.builder.group({
      account: [],
      basic: [],
      preferences: [],
    });
  }

  onRegister() {
    const preferences: Preferences = {
      game: this.game?.value,
      rank: this.rank?.value,
      role: this.role?.value,
      feminine: false,
    };

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

  get nickname() {
    return this.registerForm.value.account.nickname;
  }

  get email() {
    return this.registerForm.value.account.email;
  }

  get password() {
    return this.registerForm.value.account.password;
  }

  get fullname() {
    return this.registerForm.value.basic.fullname;
  }

  get birthday() {
    return this.registerForm.value.basic.birthday;
  }

  get gender() {
    return this.registerForm.value.basic.gender;
  }

  get game() {
    return this.registerForm.value.preferences.game;
  }

  get role() {
    return this.registerForm.value.preferences.role;
  }

  get rank() {
    return this.registerForm.value.preferences.rank;
  }
}
