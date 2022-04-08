import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player/player.service';
import { TeamService } from 'src/app/services/team/team.service';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/Player';
import { Team } from 'src/app/models/Team';
import { BasicInfoData } from 'src/app/models/BasicInformation';
import { MatDialog } from '@angular/material/dialog';
import { BasicFormComponent } from 'src/app/components/basic-form/basic-form.component';

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
    private router: Router,
    private dialog: MatDialog
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

  editAccountInformation(): void {}

  editBasicInformation(): void {
    const dialogRef = this.dialog.open(BasicFormComponent, {
      width: '250px',
      data: {
        nickname: this.player.nickname,
        fullname: this.player.fullname,
        email: this.player.email,
        birthday: this.player.birthday,
        gender: this.player.gender,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }
  editGamePreferences(): void {}
}
