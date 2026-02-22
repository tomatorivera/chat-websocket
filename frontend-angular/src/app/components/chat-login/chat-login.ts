import { Component, EventEmitter, Input, Output, input } from '@angular/core';
import { Mensaje } from '../../models/mensaje';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-login',
  imports: [FormsModule],
  templateUrl: './chat-login.html',
  styleUrl: './chat-login.css',
})
export class ChatLogin {
  @Input() mensaje!: Mensaje
  @Input() error!: string | null;
  @Output() conectar = new EventEmitter<void>();
}
