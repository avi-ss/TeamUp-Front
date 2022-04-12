import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from 'src/app/models/Team';

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
}
