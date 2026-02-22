import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Mensaje } from '../../models/mensaje';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

  // cliente!: Stomp.Client;
  // conectado = signal<boolean>(false);
  // escribiendo = signal<string>('');
  
  // idClienteActual!: string;
  // nombreClienteActual!:string;

  errorLogin = signal<string | null>(null)

  constructor(public chatService: ChatService) {
    // this.idClienteActual = 'id-' + new Date().getTime();
  }

  // La lista de mensajes almacena todos los mensajes del chat
  // El mensaje (en singular) lo mapeo al formulario
  // mensajes = signal<Mensaje[]>([]);
  // mensaje: Mensaje = new Mensaje();

  // ngOnInit(): void {
  //   this.chatService.conectar();

  //   // Configuro el cliente bajo el protocolo STOMP
  //   this.cliente = new Stomp.Client({
  //     // No lo utilizo, porque me comunico al broker mediante HTTP usando SockJS
  //     brokerURL: undefined, 
  //     // Endpoint configurado en el backend como base para las conexiones
  //     webSocketFactory: () => new SockJS('http://localhost:8080/chat-websocket'),
  //     // Debugger simple
  //     debug: str => console.log(str),
  //     // Tiempo en MS de reconexión si se pierde abruptamente
  //     reconnectDelay: 5000
  //   });

  //   // Desconexión
  //   this.cliente.onDisconnect = (frame) => {
  //     this.conectado.set(false);
  //     console.log(`Desconectado: ${!this.cliente.connected} : ${frame}`);

  //     this.mensaje = new Mensaje();
  //     this.mensajes.set([]);
  //   }
  // }

  conectarChat(): void {
    this.errorLogin.set(null);
    if (!this.chatService.mensaje.usuario || this.chatService.mensaje.usuario.trim() === '')
    {
      this.errorLogin.set('El usuario no puede estar vacío');
    }
    else
    {
      this.chatService.conectar();
    }
  }

  desconectarChat(): void {
    this.chatService.desconectar();
  }

  alEnviarMensaje(): void {
    this.chatService.enviarMensaje();
  }

  alEscribir(): void {
    this.chatService.notificarEscritura();
  }

  estaConectado(): boolean {
    return this.chatService.conectado();
  }

  getUsuarioEscribiendo(): string {
    return this.chatService.escribiendo();
  }

  getMensajeActual(): Mensaje {
    return this.chatService.mensaje;
  }

  getMensajes(): Mensaje[] {
    return this.chatService.mensajes();
  }

  getNombreClienteActual(): string {
    return this.chatService.nombreClienteActual;
  }
}
