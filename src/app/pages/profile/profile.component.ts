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
import { AuthService } from 'src/app/services/auth.service';
import { LogoutDialogComponent } from 'src/app/components/logout-dialog/logout-dialog.component';

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

  // Edit
  genders: Gender[] = [
    { name: 'Masculine', value: 'MASC' },
    { name: 'Feminine', value: 'FEM' },
    { name: 'Other', value: 'OTHER' },
  ];
  maxDate: Date = new Date();

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
    private dialog: MatDialog,
    private tokenService: TokenService,
    private builder: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService
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

        // Create the forms
        this.createAccountForm();
        this.createBasicInfoForm();

        if (this.player.team != undefined) {
          this.hasTeam = true;
          this.teamService.getTeamById(player.team!).subscribe((team) => {
            this.playerTeam = team;
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

  editGamePreferences(): void {}

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
