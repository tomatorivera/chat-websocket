package com.tomas.backend.chatwebsocket.controllers;

import com.tomas.backend.chatwebsocket.models.Mensaje;
import com.tomas.backend.chatwebsocket.services.IMensajeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Date;

@Controller
public class ChatController {

    private final Logger log;
    private final IMensajeService mensajeService;
    private final SimpMessagingTemplate webSocket;

    public ChatController(IMensajeService mensajeService, SimpMessagingTemplate webSocket) {
        this.log = LoggerFactory.getLogger(ChatController.class);
        this.mensajeService = mensajeService;
        this.webSocket = webSocket;
    }

    // El frontend referenciará este "canal" usando /app/mensajes
    // Es el paralelismo de los REST Mapping's pero en websockets
    @MessageMapping("/mensajes")
    // Especifica hacia qué "canal" notifica el backend la respuesta
    // NOTA: aquí si usamos el prefijo establecido en la configuración @WebSocketConfig.java
    @SendTo("/chat/mensajes")
    public Mensaje recibirMensaje(Mensaje mensaje) {
        mensaje.setFecha(new Date().getTime());
        log.info("Msg recibido por el broker -> " + mensaje.getMensaje());

        if (mensaje.getTipo().equals("NEW_USER"))
        {
            mensaje.setMensaje(mensaje.getUsuario());
        }
        else
        {
            mensajeService.guardar(mensaje);
        }

        return mensaje;
    }

    @MessageMapping("/escribiendo")
    @SendTo("/chat/escribiendo")
    public String estaEscribiendo(String username) {
        log.info("Señal de usuario escribiendo -> @" + username);
        return username;
    }

    @MessageMapping("/historial")
    public void listarMensajes(String idCliente) {
        log.info("Solicitud de historial -> @" + idCliente);
//        List<Mensaje> mensajes = mensajeService.listar();
//        mensajes.forEach(msg -> {
//            log.info("Mensaje: " + msg);
//        });

        // Recibo el body, lo convierto y reenvío por /chat/historial/idCliente
        webSocket.convertAndSend("/chat/historial/".concat(idCliente), mensajeService.listar());
    }

}
