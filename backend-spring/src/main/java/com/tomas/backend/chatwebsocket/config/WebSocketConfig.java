package com.tomas.backend.chatwebsocket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // <-- Habilita el servidor websocket, y a continuación lo configuro
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Configuraciones de la ruta base del broker mediante la cual puede conectarse el frontend
        registry.addEndpoint("/chat-websocket")
                // Configuración de orígenes permitidos para CORS
                .setAllowedOrigins("http://localhost:4200")
                // Activo el cliente SockJS, mediante el cual se conecta el frontend
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Configura el prefijo del Bróker de Mensajes. Define que cualquier mensaje cuyo destino comience
        // con /chat/ será manejado por un bróker sencillo en memoria. Si está en memoria obviamente
        // se pierde al reiniciar la app, aquí es donde juegan un papel importante brokers más
        // robustos como RabbitMQ.
        registry.enableSimpleBroker("/chat/");

        // Esta línea define el prefijo para los mensajes que van del cliente hacia el servidor (el "Input").
        // Establece que si se recibe un mensaje que empieza con /app, no lo manda directamente al broker sino
        // que se manda primero a mis controladores (@Controller) para que lo procesen.
        registry.setApplicationDestinationPrefixes("/app");
    }
}
