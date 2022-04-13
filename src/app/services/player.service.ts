import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Player } from 'src/app/models/Player';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private apiUrl = 'http://localhost:8080/player';

  constructor(private httpClient: HttpClient) {}

  addPlayer(player: Player): Observable<string> {
    return this.httpClient.post<string>(this.apiUrl, player, httpOptions);
  }

  getPlayerById(id: string): Observable<Player> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Player>(url);
  }

  getPlayerByNickname(nickname: string): Observable<Player> {
    const url = `${this.apiUrl}/nickname/${nickname}`;
    return this.httpClient.get<Player>(url);
  }

  checkPlayerWithNickname(nickname: string): Observable<boolean> {
    const url = `${this.apiUrl}/checkNickname/${nickname}`;
    return this.httpClient.get<boolean>(url);
  }

  checkPlayerWithEmail(email: string): Observable<boolean> {
    const url = `${this.apiUrl}/checkEmail/${email}`;
    return this.httpClient.get<boolean>(url);
  }

  modifyPlayer(id: string, player: Player): Observable<Player> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.put<Player>(url, player, httpOptions);
  }

  deletePlayer(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url);
  }
}
