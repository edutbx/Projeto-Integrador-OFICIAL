package com.br.iasaude.saudemais.auth.repository;

import com.br.iasaude.saudemais.auth.model.Paciente;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PacienteRepository extends MongoRepository<Paciente, String> {
}
