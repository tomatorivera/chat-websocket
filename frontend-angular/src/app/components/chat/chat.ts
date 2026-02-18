import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

  cliente!: Stomp.Client;
  conectado = signal<boolean>(false);

  ngOnInit(): void {
    // Configuro el cliente bajo el protocolo STOMP
    this.cliente = new Stomp.Client({
      // No lo utilizo, porque me comunico al broker mediante HTTP usando SockJS
      brokerURL: undefined, 
      // Endpoint configurado en el backend como base para las conexiones
      webSocketFactory: () => new SockJS('http://localhost:8080/chat-websocket'),
      // Debugger simple
      debug: str => console.log(str),
      // Tiempo en MS de reconexión si se pierde abruptamente
      reconnectDelay: 5000
    });

    // Acciones a realizar cuando el usuario se conecta
    // El frame es información sobre la conexión con el broker
    this.cliente.onConnect = (frame) => {
      this.conectado.set(true);
      console.log(`Conectado: ${this.cliente.connected} : ${frame}`);
    }

    this.cliente.onDisconnect = (frame) => {
      this.conectado.set(false);
      console.log(`Desconectado: ${!this.cliente.connected} : ${frame}`);
    }

    // this.conectarChat();
  }

  conectarChat(): void {
    this.cliente.activate();
  }

  desconectarChat(): void {
    this.cliente.deactivate();
  }

}
