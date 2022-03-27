import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private API_URI = "http://localhost:8080/game";

  constructor(private httpClient: HttpClient) { 

  }
}
