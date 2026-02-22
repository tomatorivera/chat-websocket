import { Injectable, signal } from "@angular/core";
import * as Stomp from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { Mensaje } from "../models/mensaje";

@Injectable({ providedIn: 'root' })
export class ChatService {

  clienteStomp!: Stomp.Client;
  conectado = signal<boolean>(false);
  escribiendo = signal<string>('');

  idClienteActual!: string;
  nombreClienteActual!: string;

  // La lista de mensajes almacena todos los mensajes del chat
  // El mensaje (en singular) lo mapeo al formulario
  mensajes = signal<Mensaje[]>([]);
  mensaje: Mensaje = new Mensaje();

  constructor() {
    this.idClienteActual = 'id-' + new Date().getTime();
  }

  conectar(): void {
    // Configuro el cliente bajo el protocolo STOMP
    this.clienteStomp = new Stomp.Client({
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
    this.clienteStomp.onConnect = (frame) => {
      this.conectado.set(true);
      console.log(`Conectado: ${this.clienteStomp.connected} : ${frame}`);

      // Gestionar mensajes nuevos
      this.clienteStomp.subscribe('/chat/mensajes', evento => {
        const nuevoMensaje = JSON.parse(evento.body);
        this.mensajes.update(listaActual => [...listaActual, nuevoMensaje]);
      });

      // Notificaciones de usuarios escribiendo
      this.clienteStomp.subscribe('/chat/escribiendo', evento => {
        if (evento.body != this.mensaje.usuario) {
          this.escribiendo.set(evento.body);
          setTimeout(() => this.escribiendo.set(''), 3000);
        }
      })

      // Historial de mensajes
      this.clienteStomp.subscribe(`/chat/historial/${this.idClienteActual}`, evento => {
        this.mensajes.set(JSON.parse(evento.body) as Mensaje[]);
      })
      this.clienteStomp.publish({
        destination: '/app/historial',
        body: this.idClienteActual
      });

      // Mensaje de unión al chat
      this.mensaje.tipo = 'NEW_USER';
      this.nombreClienteActual = this.mensaje.usuario;
      this.clienteStomp.publish({
        destination: '/app/mensajes',
        body: JSON.stringify(this.mensaje)
      });
    }

    this.clienteStomp.onDisconnect = () => {
      this.conectado.set(false);
      this.mensajes.set([]);
      this.mensaje = new Mensaje();
    };

    this.clienteStomp.activate();
  }

  desconectar(): void {
    this.clienteStomp.deactivate();
  }

  notificarEscritura(): void {
    this.clienteStomp.publish({
      destination: '/app/escribiendo',
      body: this.mensaje.usuario
    });
  }

  enviarMensaje(): void {
    this.mensaje.tipo = 'MESSAGE';
    this.clienteStomp.publish({
      destination: '/app/mensajes',
      body: JSON.stringify(this.mensaje)
    });

    this.mensaje.mensaje = '';
    this.escribiendo.set('');
  }

}