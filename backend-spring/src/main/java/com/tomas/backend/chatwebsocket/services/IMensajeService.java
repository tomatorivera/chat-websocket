package com.tomas.backend.chatwebsocket.services;

import com.tomas.backend.chatwebsocket.models.Mensaje;

import java.util.List;

public interface IMensajeService {
    List<Mensaje> listar();
    void guardar(Mensaje mensaje);
}
