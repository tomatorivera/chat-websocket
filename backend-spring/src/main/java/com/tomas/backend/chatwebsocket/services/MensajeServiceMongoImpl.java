package com.tomas.backend.chatwebsocket.services;

import com.tomas.backend.chatwebsocket.models.Mensaje;
import com.tomas.backend.chatwebsocket.repositories.IMensajeRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Primary
public class MensajeServiceMongoImpl implements IMensajeService {

    private final IMensajeRepository msgRepository;

    public MensajeServiceMongoImpl(IMensajeRepository msgRepository) {
        this.msgRepository = msgRepository;
    }

    @Override
    public List<Mensaje> listar() {
        return msgRepository.findAll();
    }

    @Override
    public void guardar(Mensaje mensaje) {
        msgRepository.save(mensaje);
    }
}
