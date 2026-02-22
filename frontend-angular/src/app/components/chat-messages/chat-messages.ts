import { Component, Input } from '@angular/core';
import { Mensaje } from '../../models/mensaje';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat-messages',
  imports: [DatePipe],
  templateUrl: './chat-messages.html',
  styleUrl: './chat-messages.css',
})
export class ChatMessages {
  @Input() mensajes!: Mensaje[];
  @Input() nombreUsuarioActual!: string;
}
