import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerLogin } from '../models/PlayerLogin';
import { Observable } from 'rxjs';
import { Token } from '../models/Token';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authURL = 'http://localhost:8080/auth/';

  constructor(private httpClient: HttpClient) {}

  public loginPlayer(player: PlayerLogin): Observable<Token> {
    return this.httpClient.post<Token>(
      this.authURL + 'login',
      player,
      httpOptions
    );
  }

  public refreshToken(token: Token): Observable<Token> {
    return this.httpClient.post<Token>(
      this.authURL + 'refresh',
      token,
      httpOptions
    );
  }
}
