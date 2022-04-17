import { Component, OnInit } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from 'src/app/services/team.service';
import { Player } from 'src/app/models/Player';
import { Team } from 'src/app/models/Team';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from 'src/app/components/delete-dialog/delete-dialog.component';
import { TokenService } from 'src/app/services/token.service';
import { Gender } from 'src/app/models/Gender';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { map, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogoutDialogComponent } from 'src/app/components/logout-dialog/logout-dialog.component';
import { Game } from 'src/app/models/Game';
import { GameService } from 'src/app/services/game.service';
import { TeamPreferences } from 'src/app/models/TeamPreferences';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  // Data
  player: Player;
  hasTeam: boolean = false;
  playerTeam: Team;
  teamPreferences: TeamPreferences;
  teamMembers: Player[] = [];

  // Edit
  genders: Gender[] = [
    { name: 'Masculine', value: 'MASC' },
    { name: 'Feminine', value: 'FEM' },
    { name: 'Other', value: 'OTHER' },
  ];
  userTypes = [
    { name: 'Players', value: 'PLAYER' },
    { name: 'Teams', value: 'TEAM' },
  ];
  maxDate: Date = new Date();
  games: Game[] = [];

  // Forms
  accountForm: FormGroup = this.builder.group({});
  basicInfoForm: FormGroup = this.builder.group({});
  preferencesForm: FormGroup = this.builder.group({});
  nicknameErrorMessage: string = '';
  emailErrorMessage: string = '';

  // Declaring the Promise, yes! Promise!
  dataLoaded: Promise<boolean>;

  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private gameService: GameService,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private builder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    // Setting max date.
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear() - 16);
    this.maxDate = currentDate;
  }

  ngOnInit(): void {
    /*
    const routeArray = this.router.url.split('/');
    const routeNickname: string = routeArray[routeArray.length - 1];
    */

    const loggedNickname: string = this.tokenService.getNickname()!;

    console.log(loggedNickname);
    this.loadData(loggedNickname);
  }

  private loadData(loggedNickname: string) {
    this.playerService
      .getPlayerByNickname(loggedNickname)
      .subscribe((player) => {
        this.player = player;
        console.log(player);

        this.gameService.getGames().subscribe((games) => {
          this.games = games;
          console.log(games);

          // Create the form
          this.createPreferencesForm();
        });

        // Create the forms
        this.createAccountForm();
        this.createBasicInfoForm();

        if (this.player.team != undefined) {
          this.hasTeam = true;
          this.teamService.getTeamById(player.team!).subscribe((team) => {
            this.playerTeam = team;
            // Get the team preferences
            this.teamService
              .getTeamPreferencesById(team.id!)
              .subscribe((preferences) => {
                this.teamPreferences = preferences;
              });
            // Get the members
            this.playerTeam.members.forEach((id) => {
              this.playerService.getPlayerById(id).subscribe((member) => {
                this.teamMembers.push(member);
                this.dataLoaded = Promise.resolve(true);
              });
            });
          });
        } else {
          this.dataLoaded = Promise.resolve(true);
        }
      });
  }

  private modifyPlayer(modifiedPlayer: Player, logout: boolean) {
    console.log(modifiedPlayer);
    this.playerService.modifyPlayer(this.player.id!, modifiedPlayer).subscribe(
      (newPlayer) => {
        console.log(newPlayer);
        this.player = newPlayer;

        if (logout) this.tokenService.logOut();

        this.snackBar.open('Your profile updated successfully', 'Dismiss', {
          duration: 2000,
        });
      },
      (error) => {
        this.snackBar.open('Unexpected error during modification', 'Dismiss', {
          duration: 2000,
        });
      }
    );
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

  createNewTeam() {}

  editAccountInformation(): void {
    // Check if there are any changes
    if (
      this.player.nickname === this.nickname?.value &&
      this.player.email === this.email?.value
    ) {
      this.snackBar.open("You haven't changed anything", 'Dismiss', {
        duration: 2000,
      });
      return;
    }

    // If we change the nickname we must log out
    const logout: boolean = this.player.nickname !== this.nickname?.value;

    // We create a clone of the player
    const modifiedPlayer = { ...this.player };

    modifiedPlayer.nickname = this.nickname?.value;
    modifiedPlayer.email = this.email?.value;

    // TODO: Cuando envio la contraseña cifrada, me da error de longitud
    modifiedPlayer.password = 'password123';

    if (logout) {
      const dialogRef = this.dialog.open(LogoutDialogComponent, {});

      dialogRef.afterClosed().subscribe((result) => {
        if (result == undefined) return;

        this.modifyPlayer(modifiedPlayer, logout);
      });
    }
  }

  editBasicInformation(): void {
    // Check if there are any changes
    if (
      this.player.fullname === this.fullname?.value &&
      this.player.birthday === this.birthday?.value &&
      this.player.gender === this.gender?.value
    ) {
      this.snackBar.open("You haven't changed anything", 'Dismiss', {
        duration: 2000,
      });
      return;
    }

    // We create a clone of the player
    const modifiedPlayer = { ...this.player };

    modifiedPlayer.fullname = this.fullname?.value;
    modifiedPlayer.birthday = this.birthday?.value;
    modifiedPlayer.gender = this.gender?.value;

    // TODO: Cuando envio la contraseña cifrada, me da error de longitud
    modifiedPlayer.password = 'password123';

    this.modifyPlayer(modifiedPlayer, false);
  }

  editGamePreferences(): void {
    // Check if there are any changes
    if (
      this.player.preferences.game === this.game?.value &&
      this.player.preferences.role === this.role?.value &&
      this.player.preferences.rank === this.rank?.value &&
      this.player.preferences.feminine === this.feminine?.value &&
      this.player.preferences.wantedUser === this.wantedUser?.value
    ) {
      this.snackBar.open("You haven't changed anything", 'Dismiss', {
        duration: 2000,
      });
      return;
    }

    // We create a clone of the player
    const modifiedPlayer = { ...this.player };

    modifiedPlayer.preferences.game = this.game?.value;
    modifiedPlayer.preferences.role = this.role?.value;
    modifiedPlayer.preferences.rank = this.rank?.value;
    modifiedPlayer.preferences.feminine = this.feminine?.value;
    modifiedPlayer.preferences.wantedUser = this.wantedUser?.value;

    // TODO: Cuando envio la contraseña cifrada, me da error de longitud
    modifiedPlayer.password = 'password123';

    this.modifyPlayer(modifiedPlayer, false);
  }

  get nickname() {
    return this.accountForm.get('nickname');
  }

  get email() {
    return this.accountForm.get('email');
  }

  get fullname() {
    return this.basicInfoForm.get('fullname');
  }

  get birthday() {
    return this.basicInfoForm.get('birthday');
  }

  get gender() {
    return this.basicInfoForm.get('gender');
  }

  get game() {
    return this.preferencesForm.get('game');
  }

  get role() {
    return this.preferencesForm.get('role');
  }

  get roles() {
    let gameIndex = 0;

    this.games.forEach((game, index) => {
      if (game.name == this.game?.value) {
        gameIndex = index;
      }
    });

    // Si tiene equipo
    if (this.hasTeam) {
      const allRoles = this.games[gameIndex].roles;
      const takenRoles = this.teamPreferences.takenRoles;
      // Obtenemos los roles disponibles
      const availableRoles = allRoles.filter(
        (role) => takenRoles.indexOf(role.name) < 0
      );

      // Y añadimos el propio del jugador
      const playerRole = allRoles.find(
        (r) => r.name === this.player.preferences.role
      );
      availableRoles.push(playerRole!);
      return availableRoles;
    }

    // Si no, devolvemos todos
    return this.games[gameIndex].roles;
  }

  get rank() {
    return this.preferencesForm.get('rank');
  }

  get ranks() {
    let gameIndex = 0;

    this.games.forEach((game, index) => {
      if (game.name == this.game?.value) {
        gameIndex = index;
      }
    });

    return this.games[gameIndex].ranks;
  }

  get feminine() {
    return this.preferencesForm.get('feminine');
  }

  get wantedUser() {
    return this.preferencesForm.get('wantedUser');
  }

  private createAccountForm() {
    this.accountForm = this.builder.group({
      nickname: [
        this.player.nickname,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(16),
          Validators.pattern('^[^0-9\\\\]\\w+$'),
        ],
        [this.nicknameValidator()],
      ],
      email: [
        this.player.email,
        [Validators.required, Validators.email],
        [this.emailValidator()],
      ],
    });
  }

  private createBasicInfoForm() {
    this.basicInfoForm = this.builder.group({
      fullname: [
        this.player.fullname,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
          Validators.pattern('^[A-Z][a-z]*(\\s[A-Z][a-z]*)?'),
        ],
      ],
      birthday: [this.player.birthday, [Validators.required]],
      gender: [this.player.gender, [Validators.required]],
    });
  }

  private createPreferencesForm() {
    this.preferencesForm = this.builder.group({
      game: [
        { value: this.player.preferences.game, disabled: this.hasTeam },
        [Validators.required],
      ],
      role: [this.player.preferences.role, [Validators.required]],
      rank: [this.player.preferences.rank, [Validators.required]],
      feminine: [
        {
          value: this.player.preferences.feminine,
          disabled: this.gender?.value === 'MASC',
        },
        [],
      ],
      wantedUser: [
        { value: this.player.preferences.wantedUser, disabled: this.hasTeam },
        [],
      ],
    });
  }

  private nicknameValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.playerService.checkPlayerWithNickname(control.value).pipe(
        map((response: boolean) => {
          if (response) {
            if (this.player.nickname === control.value) {
              return null;
            }
            return { nicknameUsed: true };
          }
          return null;
        })
      );
  }

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      this.playerService.checkPlayerWithEmail(control.value).pipe(
        map((response: boolean) => {
          if (response) {
            if (this.player.email === control.value) {
              return null;
            }
            return { emailUsed: true };
          }
          return null;
        })
      );
  }

  getNicknameErrorMessage() {
    if (this.accountForm != null) {
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
      } else if (this.nickname?.hasError('pattern')) {
        this.nicknameErrorMessage = 'Only letters and numbers';
        return true;
      }
    }
    this.nicknameErrorMessage = '';
    return false;
  }

  getEmailErrorMessage() {
    if (this.accountForm != null) {
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
}
