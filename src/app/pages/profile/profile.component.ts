import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player/player.service';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/Player';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  player: Player;

  constructor(private playerService: PlayerService, private router: Router) {
    this.player = {
      id: '',
      nickname: '',
      email: '',
      birthday: '',
      fullname: '',
      gender: '',
      password: '',
      preferences: { game: '', rank: '', role: '', feminine: false },
    };
  }

  ngOnInit(): void {
    const routeArray = this.router.url.split('/');
    const id: string = routeArray[routeArray.length - 1];

    console.log(id);

    this.playerService.getPlayerById(id).subscribe((player) => {
      this.player = player;
    });

    console.log(this.player);
  }
}
