import { Role } from './Role';
import { Rank } from './Rank';

export interface Game {
  id?: number;
  name: string;
  roles: Role[];
  ranks: Rank[];
}
