import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mensaje } from '../../models/mensaje';

@Component({
  selector: 'app-chat-input',
  imports: [FormsModule],
  templateUrl: './chat-input.html',
  styleUrl: './chat-input.css',
})
export class ChatInput {
  @Input() mensajeActual!: Mensaje;
  @Output() enviarMensaje = new EventEmitter<void>();
  @Output() escribiendo = new EventEmitter<void>();
}
