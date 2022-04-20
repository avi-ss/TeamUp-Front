import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/Team';
import { TeamPreferences } from '../models/TeamPreferences';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiUrl = 'http://localhost:8080/team';

  constructor(private httpClient: HttpClient) {}

  createTeam(team: Team): Observable<string> {
    return this.httpClient.post<string>(this.apiUrl, team, httpOptions);
  }

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

  checkTeamWithName(name: string): Observable<boolean> {
    const url = `${this.apiUrl}/checkName/${name}`;
    return this.httpClient.get<boolean>(url);
  }

  deleteTeam(id: string) {
    const url = `${this.apiUrl}/${id}`;
    return this.httpClient.delete(url);
  }

  deleteTeamMember(id: string, member: string) {
    const url = `${this.apiUrl}/${id}/${member}`;
    return this.httpClient.delete(url);
  }
}
