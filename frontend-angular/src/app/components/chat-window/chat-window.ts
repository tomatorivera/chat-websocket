import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Mensaje } from '../../models/mensaje';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  imports: [FormsModule, DatePipe],
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

  ngOnInit(): void {
    if (this.mensajes.length == 0)
      console.log("####### SIN MENSAJES AL MOMENTO DE CARGAR ########");
    this.mensajes.forEach(msg => console.log(msg.mensaje));
  }
}
