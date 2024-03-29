import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'AuthToken';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  roles: Array<string> = [];

  constructor(private router: Router) {}

  public setToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public isLogged(): boolean {
    if (this.getToken()) {
      return true;
    }
    return false;
  }

  public getNickname(): string | null {
    if (!this.isLogged()) {
      return null;
    }
    const token = this.getToken();
    const payload = token?.split('.')[1];
    const payloadDecoded = atob(payload!);
    const values = JSON.parse(payloadDecoded);
    const username = values.sub;

    return username;
  }

  public isAdmin(): boolean {
    if (!this.isLogged()) {
      return false;
    }
    const token = this.getToken();
    const payload = token?.split('.')[1];
    const payloadDecoded = atob(payload!);
    const values = JSON.parse(payloadDecoded);
    const roles = values.roles;

    return roles.indexOf('ROLE_ADMIN') >= 0;
  }

  public logOut(): void {
    window.localStorage.clear();
    this.router.navigate(['/']);
  }
}
