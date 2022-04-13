import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from 'src/app/services/team.service';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/Player';
import { Team } from 'src/app/models/Team';
import { MatDialog } from '@angular/material/dialog';
import { BasicFormDialogComponent } from 'src/app/components/basic-form-dialog/basic-form-dialog.component';
import { AccountFormDialogComponent } from 'src/app/components/account-form-dialog/account-form-dialog.component';
import { PreferencesFormDialogComponent } from 'src/app/components/preferences-form-dialog/preferences-form-dialog.component';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';
import { TokenService } from 'src/app/services/token.service';

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
    private dialog: MatDialog,
    private tokenService: TokenService
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
    /*
    const routeArray = this.router.url.split('/');
    const routeNickname: string = routeArray[routeArray.length - 1];
    */

    const loggedNickname: string = this.tokenService.getNickname()!;

    console.log(loggedNickname);

    this.playerService
      .getPlayerByNickname(loggedNickname)
      .subscribe((player) => {
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

  private modifyPlayer(modifiedPlayer: Player) {
    this.playerService
      .modifyPlayer(this.player.id!, modifiedPlayer)
      .subscribe((newPlayer) => {
        console.log(newPlayer);
        this.player = newPlayer;
      });
  }

  logOut(): void {
    this.tokenService.logOut();
  }

  deletePlayer(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result == undefined) return;

      this.playerService.deletePlayer(this.player.id!).subscribe(() => {
        this.tokenService.logOut();
      });
    });
  }

  editAccountInformation(): void {
    const dialogRef = this.dialog.open(AccountFormDialogComponent, {
      data: {
        nickname: this.player.nickname,
        email: this.player.email,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result == undefined) return;

      const modifiedPlayer = this.player;

      modifiedPlayer.nickname = result.nickname;
      modifiedPlayer.email = result.email;
      modifiedPlayer.password = result.password;

      this.modifyPlayer(modifiedPlayer);
    });
  }

  editBasicInformation(): void {
    const dialogRef = this.dialog.open(BasicFormDialogComponent, {
      data: {
        fullname: this.player.fullname,
        birthday: this.player.birthday,
        gender: this.player.gender,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result == undefined) return;

      const modifiedPlayer = this.player;

      modifiedPlayer.fullname = result.fullname;
      modifiedPlayer.birthday = result.birthday.format('YYYY-MM-DD');
      modifiedPlayer.gender = result.gender.toUpperCase();

      // TODO: Cuando envio la contraseña cifrada, me da error de longitud
      modifiedPlayer.password = 'password123';

      this.modifyPlayer(modifiedPlayer);
    });
  }

  editGamePreferences(): void {
    const dialogRef = this.dialog.open(PreferencesFormDialogComponent, {
      data: {
        game: this.player.preferences.game,
        rank: this.player.preferences.rank,
        role: this.player.preferences.role,
        feminine: this.player.preferences.feminine,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result);

      if (result == undefined) return;

      const modifiedPlayer = this.player;

      modifiedPlayer.preferences.game = result.game;
      modifiedPlayer.preferences.role = result.role;
      modifiedPlayer.preferences.rank = result.rank;

      // TODO: No recoge el value correctamente
      modifiedPlayer.preferences.feminine = false;

      // TODO: Cuando envio la contraseña cifrada, me da error de longitud
      modifiedPlayer.password = 'password123';

      this.modifyPlayer(modifiedPlayer);
    });
  }
}
