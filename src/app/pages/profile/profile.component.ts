import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player/player.service';
import { TeamService } from 'src/app/services/team/team.service';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/Player';
import { Team } from 'src/app/models/Team';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // Data
  player: Player;
  playerTeam: Team;
  teamMembers: Player[] = [];
  hasTeam: boolean = false;

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router
  ) {
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
    this.playerTeam = {
      id: '',
      members: [],
    };
  }

  ngOnInit(): void {
    const routeArray = this.router.url.split('/');
    const id: string = routeArray[routeArray.length - 1];

    console.log(id);

    this.playerService.getPlayerById(id).subscribe((player) => {
      this.player = player;
      console.log(this.player.team);
      if (this.player.team != undefined) {
        this.hasTeam = true;
        this.teamService.getTeamById(player.team!).subscribe((team) => {
          this.playerTeam = team;
          this.playerTeam.members.forEach((id) => {
            this.playerService.getPlayerById(id).subscribe((member) => {
              this.teamMembers.push(member);
            });
          });
        });
      }
    });
  }

  editBasicInformation() {}
  editGamePreferences() {}
}
