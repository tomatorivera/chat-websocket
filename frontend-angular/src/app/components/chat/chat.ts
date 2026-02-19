import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as Stomp from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe ],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

  cliente!: Stomp.Client;
  conectado = signal<boolean>(false);
  escribiendo = signal<string>('');
  
  idCliente!: string;

  constructor() {
    // To-Do: reimplementación con MongoDb
    this.idCliente = 'id-' + new Date().getTime();
  }

  // La lista de mensajes almacena todos los mensajes del chat
  // El mensaje (en singular) lo mapeo al formulario
  mensajes = signal<Mensaje[]>([]);
  mensaje: Mensaje = new Mensaje();

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

      this.cliente.subscribe('/chat/mensajes', evento => {
        // Aquí proceso todos los mensajes que van llegando
        console.log(evento.body);

        const nuevoMensaje = JSON.parse(evento.body);
        this.mensajes.update(listaActual => [...listaActual, nuevoMensaje]);
      });

      // Notificaciones de usuarios escribiendo
      this.cliente.subscribe('/chat/escribiendo', evento => {
        if (evento.body != this.mensaje.usuario)
        {
          this.escribiendo.set(evento.body + ' está escribiendo...');
          setTimeout(() => this.escribiendo.set(''), 3000);
        }
      })

      // Historial de mensajes
      this.cliente.subscribe(`/chat/historial/${this.idCliente}`, evento => {
          this.mensajes.set(JSON.parse(evento.body) as Mensaje[]);
      })
      this.cliente.publish({
        destination: '/app/historial', 
        body: this.idCliente
      });

      // Mensaje de unión al chat
      this.mensaje.tipo = 'NEW_USER';
      this.cliente.publish({
        destination: '/app/mensajes',
        body: JSON.stringify(this.mensaje)
      });
    }

    // Desconexión
    this.cliente.onDisconnect = (frame) => {
      this.conectado.set(false);
      console.log(`Desconectado: ${!this.cliente.connected} : ${frame}`);

      this.mensaje = new Mensaje();
      this.mensajes.set([]);
    }
  }

  conectarChat(): void {
    this.cliente.activate();
  }

  desconectarChat(): void {
    this.cliente.deactivate();
  }

  alEnviarMensaje(): void {
    this.mensaje.tipo = 'MESSAGE';
    this.cliente.publish({
      destination: '/app/mensajes',
      body: JSON.stringify(this.mensaje)
    });

    this.mensaje.mensaje = '';
    this.escribiendo.set('');
  }

  alEscribir(): void {
    this.cliente.publish({
      destination: '/app/escribiendo',
      body: this.mensaje.usuario
    });
  }
}
