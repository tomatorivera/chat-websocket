import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mensaje } from '../../models/mensaje';
import { FormsModule } from '@angular/forms';
import { ChatMessages } from "../chat-messages/chat-messages";
import { ChatInput } from "../chat-input/chat-input";

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, ChatMessages, ChatInput],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.css',
})
export class ChatWindow {
  @Input() mensajes!: Mensaje[];
  @Input() mensajeActual!: Mensaje;
  @Input() nombreUsuarioActual!: string;
  @Input() usuarioEscribiendo!: string;
  @Output() enviarMensaje = new EventEmitter<void>();
  @Output() escribiendo = new EventEmitter<void>();
  @Output() desconectar = new EventEmitter<void>();
}
