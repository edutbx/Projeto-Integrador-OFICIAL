package com.br.iasaude.saudemais.auth.repository;

import com.br.iasaude.saudemais.auth.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByCrm(String crm);
    boolean existsByCrm(String crm);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
}
