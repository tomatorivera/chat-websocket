package com.tomas.backend.chatwebsocket.services;

import com.tomas.backend.chatwebsocket.models.Mensaje;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MensajeServiceImpl implements IMensajeService {

    // To-Do: Implementar persistencia con MongoDb
    private final List<Mensaje> mensajes;

    public MensajeServiceImpl() {
        mensajes = new ArrayList<>();
    }

    @Override
    public List<Mensaje> listar() {
        return this.mensajes;
    }

    @Override
    public void guardar(Mensaje mensaje) {
        this.mensajes.add(mensaje);
    }

}
