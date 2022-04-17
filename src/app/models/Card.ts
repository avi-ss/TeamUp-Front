import { Player } from './Player';
import { Team } from './Team';

export interface Card {
  user: Player | Team;
  visible: boolean;
}
