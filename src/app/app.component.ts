import { Component } from '@angular/core';

// Services
import { GameService } from './services/game/game.service';
import { TeamService } from './services/team/team.service';
import { PlayerService } from './services/player/player.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TeamFinderApp-Front';
}
