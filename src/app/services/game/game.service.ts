import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Game } from 'src/app/models/Game';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private apiUrl = 'http://localhost:8080/game';

  constructor(private httpClient: HttpClient) {}

  getGames(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(this.apiUrl);
  }

  getGameById(id: number): Observable<Game> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Game>(url);
  }
}
