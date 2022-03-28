import { Preferences } from './Preferences';

export interface Player {
  id?: string;
  nickname: string;
  email: string;
  password: string;
  fullname: string;
  birthday: string;
  gender: string;
  preferences: Preferences;
}
