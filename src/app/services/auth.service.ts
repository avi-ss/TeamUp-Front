import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PlayerLogin } from '../models/PlayerLogin';
import { Observable } from 'rxjs';
import { JwtDTO } from '../models/JwtDTO';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authURL = 'http://localhost:8080/login';

  constructor(private httpClient: HttpClient) {}

  public loginPlayer(player: PlayerLogin): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL, player, httpOptions);
  }
}
