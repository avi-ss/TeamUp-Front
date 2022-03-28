import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  modifyPlayer(id: string, player: Player): Observable<Player> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.put<Player>(url, player, httpOptions);
  }

  deletePlayer(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url);
  }
}
