import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Client, IMessage } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Message } from 'src/app/models/Message';
import { Notification } from 'src/app/models/Notification';
import { Player } from 'src/app/models/Player';
import { ChatService } from 'src/app/services/chat.service';
import { PlayerService } from 'src/app/services/player.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
  // Conexión to the broker
  private url: string = 'http://localhost:8080/ws';
  private client: Client;

  // Atributos del chat
  currentUser: Player;
  activeContact: Player;
  contacts: Player[] = [];
  messageText: string = '';
  messages: Message[] = [];

  constructor(
    private tokenService: TokenService,
    private chatService: ChatService,
    private playerService: PlayerService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Obtenemos el usuario actual y la lista de contactos como los usuarios
    // que hicieron match con el usuario actual
    this.loadData();

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
      this.client.subscribe(
        '/user/' + this.currentUser.id + '/queue/messages',
        (e) => this.onMessageRecieved
      );
    };

    // Error handling
    this.client.onStompError = (error) => {
      console.error(error);
    };

    this.client.onWebSocketError = (error) => {
      console.error(error);
    };

    this.client.activate();
  }

  private onMessageRecieved = (msg: IMessage) => {
    // Recibimos una notificación
    const notification: Notification = JSON.parse(msg.body) as Notification;
    console.log(notification);

    // Comparamos si el chat activo es igual al de la notificación
    if (this.activeContact.id === notification.senderId)
      // Insertamos el mensaje dentro de la lista
      this.chatService
        .findMessage(notification.id!)
        .subscribe((message: Message) => {
          console.log(message);
          this.messages.push(message);
        });
    // Si no, abrimos una notificación
    else {
      this.snackBar.open(
        'Received a new message from ' + notification.senderName,
        'Dismiss',
        {
          duration: 2000,
        }
      );
    }
    // Recargamos los contactos
  };

  sendMessage = () => {
    // Si el mensaje no está vacio
    if (this.messageText.trim() !== '') {
      // Creamos el mensaje
      const message: Message = {
        senderId: this.currentUser.id!,
        recipientId: this.activeContact.id!,
        senderName: this.currentUser.nickname,
        recipientName: this.activeContact.nickname,
        content: this.messageText, // Sacar el mensaje del valor del formulario.
        timestamp: new Date(),
      };
      // Lo enviamos al broker
      this.client.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
      });
      // Añadimos el mensaje a la lista de mensajes
      this.messages.push(message);
      // Resetear el mensaje del formulario.
    }
  };

  onContactChange = (contact: Player) => {
    this.activeContact = contact;
    this.chatService
      .findMessages(this.activeContact.id!, this.currentUser.id!)
      .subscribe((msgs) => {
        this.messages = msgs;
      });
  };

  get isContactActive() {
    return this.activeContact != undefined;
  }

  private loadData() {
    // Obtenemos el nombre usuario registrado del token
    const loggedNickname: string = this.tokenService.getNickname()!;
    console.log('Logged: ' + loggedNickname);
    // Obtenemos los datos del jugador
    this.playerService
      .getPlayerByNickname(loggedNickname)
      .subscribe((player) => {
        this.currentUser = player;
        // Obtenemos la lista de contactos (usuarios que hicieron match)
        this.userService.getMatchedUsers(player.id!).subscribe((list) => {
          list.forEach((user) => {
            this.playerService.getPlayerById(user.id!).subscribe((player) => {
              this.contacts.push(player);
            });
          });
        });
      });
  }
}
