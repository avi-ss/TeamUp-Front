import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/Team';
import { TeamPreferences } from '../models/TeamPreferences';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:8080/team';

  constructor(private httpClient: HttpClient) {}

  getTeamById(id: string): Observable<Team> {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.get<Team>(url);
  }

  getTeamPreferencesById(id: string): Observable<TeamPreferences> {
    const url = `${this.apiUrl}/${id}/preferences`;
    return this.httpClient.get<TeamPreferences>(url);
  }

  getTeamsForPlayer(id: string): Observable<Team[]> {
    const url = `${this.apiUrl}/forPlayer/${id}`;
    return this.httpClient.get<Team[]>(url);
  }
}
