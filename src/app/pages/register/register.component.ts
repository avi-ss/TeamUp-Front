import { Component, OnInit } from '@angular/core';
import { Player } from 'src/app/models/Player';
import { Preferences } from 'src/app/models/Preferences';
import { Game } from 'src/app/models/Game';
import { GameService } from 'src/app/services/game/game.service';
import { PlayerService } from 'src/app/services/player/player.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  step: number = 0;
  maxSteps: number = 6;
  games: Game[] = [];

  // Step 0
  nickname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  // Step 1
  fullname: string = '';
  // Step 2
  birthday: Date = new Date();
  // Step 3
  gender: string = '';
  // PREFERENCES
  // Step 4
  gameIndex: number = 0;
  // Step 5
  role: string = '';
  // Step 6
  rank: string = '';

  constructor(
    private gameService: GameService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.games = games;
      console.log(games);
    });
  }

  nextStep(): void {
    if (!this.email) {
      alert('Email cant be empty');
      return;
    }

    if (this.step < this.maxSteps) {
      this.step += 1;
    }
  }

  onSubmit() {
    const preferences: Preferences = {
      game: this.games[this.gameIndex].name,
      rank: this.rank,
      role: this.role,
      feminine: false,
    };

    const player: Player = {
      nickname: this.nickname,
      email: this.email,
      password: this.password,
      fullname: this.fullname,
      birthday: this.birthday.toDateString(),
      gender: this.gender,
      preferences: preferences,
    };

    this.playerService.addPlayer(player).subscribe((result) => {
      console.log(result);
    });
  }
}
