package com.tomas.backend.chatwebsocket.repositories;

import com.tomas.backend.chatwebsocket.models.Mensaje;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface IMensajeRepository extends MongoRepository<Mensaje, String> {
}
