import { Component, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mensaje } from '../../models/mensaje';
import { ChatService } from '../../services/chat.service';
import { ChatLogin } from '../chat-login/chat-login';
import { ChatWindow } from "../chat-window/chat-window";

@Component({
  selector: 'app-chat',
  imports: [FormsModule, DatePipe, ChatLogin, ChatWindow],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {

  errorLogin = signal<string | null>(null)

  constructor(public chatService: ChatService) { }

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

  getNombreUsuarioActual(): string {
    return this.chatService.nombreClienteActual;
  }
}
