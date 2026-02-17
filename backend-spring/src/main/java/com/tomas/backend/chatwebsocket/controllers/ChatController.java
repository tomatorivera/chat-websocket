package com.tomas.backend.chatwebsocket.controllers;

import com.tomas.backend.chatwebsocket.models.Mensaje;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class ChatController {

    private Logger log = LoggerFactory.getLogger(ChatController.class);

    // El frontend referenciará este "canal" usando /app/mensajes
    // Es el paralelismo de los REST Mapping's pero en websockets
    @MessageMapping("/mensajes")
    // Especifica hacia qué "canal" notifica el backend la respuesta
    // NOTA: aquí si usamos el prefijo establecido en la configuración @WebSocketConfig.java
    @SendTo("/chat/mensajes")
    public Mensaje recibirMensaje(Mensaje mensaje) {
        mensaje.setFecha(new Date().getTime());
        log.info("Msg recibido por el broker -> " + mensaje.getMensaje());

        return mensaje;
    }

}
