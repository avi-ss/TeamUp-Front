import { Injectable } from '@angular/core';

const TOKEN_KEY = 'AuthToken';
const NICKNAME_KEY = 'AuthNickname';
const AUTHORITIES_KEY = 'AuthAuthorities';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<string> = [];

  constructor() {}

  public setToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public setNickname(nickname: string): void {
    window.sessionStorage.removeItem(NICKNAME_KEY);
    window.sessionStorage.setItem(NICKNAME_KEY, nickname);
  }

  public getNickname(): string | null {
    return sessionStorage.getItem(NICKNAME_KEY);
  }

  public setAuthorities(authorities: string[]): void {
    window.sessionStorage.removeItem(AUTHORITIES_KEY);
    window.sessionStorage.setItem(AUTHORITIES_KEY, JSON.stringify(authorities));
  }

  public getAuthorities(): string[] {
    this.roles = [];
    if (sessionStorage.getItem(AUTHORITIES_KEY)) {
      JSON.parse(sessionStorage.getItem(AUTHORITIES_KEY)!).forEach(
        (auth: string) => {
          this.roles.push(auth);
        }
      );
    }
    return this.roles;
  }

  public logOut(): void {
    window.sessionStorage.clear();
  }
}
