import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Card } from 'src/app/models/Card';
import { Player } from 'src/app/models/Player';
import { Team } from 'src/app/models/Team';
import { TeamPreferences } from 'src/app/models/TeamPreferences';
import { PlayerService } from 'src/app/services/player.service';
import { TeamService } from 'src/app/services/team.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  // Declaring the Promise, yes! Promise!
  dataLoaded: Promise<boolean>;

  // Player
  player: Player;

  hasTeam: boolean = false;
  playerTeam: Team;
  teams: Team[] = [];
  teamPreferences: TeamPreferences[] = [];
  teamMembers: Player[][] = [];

  // Cards
  cards: Card[] = [];
  currentIndex: number;
  cardWidth: number = 450;

  constructor(
    private tokenService: TokenService,
    private playerService: PlayerService,
    private teamService: TeamService,
    private observer: BreakpointObserver
  ) {}

  ngOnInit(): void {
    const loggedNickname: string = this.tokenService.getNickname()!;
    this.loadData(loggedNickname);
  }

  isPlayer(user: Player | Team): boolean {
    return user.hasOwnProperty('nickname');
  }

  userAsPlayer(user: Player | Team): Player {
    return user as Player;
  }

  userAsTeam(user: Player | Team): Team {
    return user as Team;
  }

  getTeam(user: Player | Team): Team {
    return this.teams.find((t) => t.members.includes(user.id!))!;
  }

  getTeamPreferences(user: Player | Team): TeamPreferences {
    const index = this.teams.findIndex((t) => t.members.includes(user.id!))!;
    return this.teamPreferences[index];
  }

  swiped(event: any, index: number) {
    console.log(this.cards[index].user + ' swiped ' + event);

    if (event) {
      this.swipeRight();
    } else {
      this.swipeLeft();
    }
  }

  // Dislike button
  swipeLeft() {
    this.cards[this.currentIndex].visible = false;
    this.currentIndex--;
  }

  // Like button
  swipeRight() {
    this.cards[this.currentIndex].visible = false;
    this.currentIndex--;
  }

  private loadData(loggedNickname: string) {
    // Obtenemos el jugador
    this.playerService
      .getPlayerByNickname(loggedNickname)
      .subscribe((player) => {
        this.player = player;

        // Si tiene equipo, lo cargamos
        if (this.player.team != undefined) {
          this.hasTeam = true;
          this.teamService.getTeamById(player.team!).subscribe((team) => {
            this.playerTeam = team;
            // Aquí cargamos los jugadores suitable porque tiene equipo
            this.playerService
              .getAllPlayersForTeam(team.id!)
              .subscribe((forTeam) => {
                console.log(forTeam);

                // Mapeamos de los usuarios al tipo Card
                this.cards = forTeam.map((p) => ({ visible: true, user: p }));
                this.currentIndex = this.cards.length - 1;

                //Una vez cargado todo, activamos el html
                this.dataLoaded = Promise.resolve(true);
              });
          });
          // Como no tiene equipo, tenemos que revisar sus preferencias
        } else {
          // Si prefiere a jugadores, se le dan jugadores
          if (this.player.preferences.wantedUser === 'PLAYER') {
            this.playerService
              .getAllPlayersForPlayer(player.id!)
              .subscribe((forPlayer) => {
                console.log(forPlayer);

                // We filter the players who need the team to be recovered
                const needTeam = forPlayer.filter((p) => p.team != undefined);

                // Si no esta vacio empezamos a cargar equipos
                if (needTeam.length != 0) {
                  needTeam.forEach((player, index) => {
                    this.teamService
                      .getTeamById(player.team!)
                      .subscribe((team) => {
                        this.teams.push(team);
                        // Get the team preferences
                        this.teamService
                          .getTeamPreferencesById(team.id!)
                          .subscribe((preferences) => {
                            this.teamPreferences.push(preferences);

                            // Si es el ultimo
                            if (index == needTeam.length - 1) {
                              this.dataLoaded = Promise.resolve(true);
                            }
                          });
                      });
                  });
                  // Si no, cargamos el html
                } else {
                  this.dataLoaded = Promise.resolve(true);
                }

                // Mapeado de los usuarios al tipo Card
                this.cards = forPlayer.map((p) => ({ visible: true, user: p }));
                this.currentIndex = this.cards.length - 1;
              });
            // Si no, se le dan equipos
          } else {
            this.teamService
              .getTeamsForPlayer(player.id!)
              .subscribe((forPlayer) => {
                console.log(forPlayer);
                // Como son equipos, tenemos que guardar sus jugadores y preferencias aparte
                // LOOPING TROUGH ALL TEAMS
                forPlayer.forEach((team, index) => {
                  // Get the team preferences
                  this.teamService
                    .getTeamPreferencesById(team.id!)
                    .subscribe((preferences) => {
                      this.teamPreferences[index] = preferences;

                      // Get the members
                      this.teamMembers.push([]);
                      forPlayer[index].members.forEach((id) => {
                        this.playerService
                          .getPlayerById(id)
                          .subscribe((member) => {
                            this.teamMembers[index].push(member);

                            // Si es el ultimo
                            if (index == forPlayer.length - 1) {
                              this.dataLoaded = Promise.resolve(true);
                            }
                          });
                      });
                    });
                });

                // Mapeado de los usuarios al tipo Card
                this.cards = forPlayer.map((p) => ({ visible: true, user: p }));
                this.currentIndex = this.cards.length - 1;
              });
          }
        }
      });
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 600px)']).subscribe((res) => {
      if (res.matches) {
        this.cardWidth = 325;
      } else {
        this.cardWidth = 400;
      }
    });
  }
}
