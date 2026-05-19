package com.br.iasaude.saudemais.auth.repository;

import com.br.iasaude.saudemais.auth.model.Paciente;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PacienteRepository extends MongoRepository<Paciente, String> {
    Optional<Paciente> findByCpf(String cpf);
    boolean existsByCpf(String cpf);
}
