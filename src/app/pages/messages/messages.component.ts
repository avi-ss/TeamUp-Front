import { Component, OnInit } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  private url: string = 'http://localhost:8080/ws';
  private client: Client;

  constructor() {}

  ngOnInit(): void {
    // Creamos el STOMP
    this.client = new Client();

    // Asignamos SockJS al STOMP
    this.client.webSocketFactory = () => {
      return new SockJS(this.url);
    };

    // Callback onConnect
    this.client.onConnect = (frameElement) => {
      console.log(
        'Conexión activa: ' + this.client.connected + ', ' + frameElement
      );
    };

    this.client.onStompError = (frameElement) => {
      console.error('Error en STOMP: ' + frameElement);
    };

    this.client.onWebSocketError = (frameElement) => {
      console.error('Error en WebSocket: ' + frameElement);
    };
  }
}
