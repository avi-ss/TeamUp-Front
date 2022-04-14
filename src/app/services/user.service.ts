import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/user';

  constructor(private httpClient: HttpClient) {}

  getMatchedUsers(id: string): Observable<User[]> {
    const url = `${this.apiUrl}/matched/${id}`;
    return this.httpClient.get<User[]>(url);
  }
}
