package com.br.iasaude.saudemais.auth.repository;

import com.br.iasaude.saudemais.auth.model.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByCrm(String crm);
    boolean existsByCrm(String crm);
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    /**
     * Retorna todos os usuários cujo Set<String> roles contém o role informado.
     * Usado pelo UserService para buscar médicos (ROLE_USER) sem trazer todos os documentos.
     */
    List<Usuario> findByRolesContaining(String role);
}
