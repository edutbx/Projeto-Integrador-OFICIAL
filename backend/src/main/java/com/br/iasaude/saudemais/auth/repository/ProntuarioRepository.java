package com.br.iasaude.saudemais.auth.repository;

import com.br.iasaude.saudemais.auth.model.Prontuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProntuarioRepository extends MongoRepository<Prontuario, String> {
    Optional<Prontuario> findByPacienteId(String pacienteId);
}