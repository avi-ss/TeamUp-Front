import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/Message';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatURL = 'http://localhost:8080/messages/';

  constructor(private httpClient: HttpClient) {}

  public countNewMessages(
    senderId: string,
    recipientId: string
  ): Observable<number> {
    return this.httpClient.get<number>(
      this.chatURL + senderId + '/' + recipientId + '/count',
      httpOptions
    );
  }

  public findMessages(
    senderId: string,
    recipientId: string
  ): Observable<Message[]> {
    return this.httpClient.get<Message[]>(
      this.chatURL + senderId + '/' + recipientId,
      httpOptions
    );
  }

  public findMessage(id: number): Observable<Message> {
    return this.httpClient.get<Message>(this.chatURL + id, httpOptions);
  }
}
