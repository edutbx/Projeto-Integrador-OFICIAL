package com.br.iasaude.saudemais.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Getter
@Setter
@Document("users")
public class Usuario {

    @Id
    private String id;

    private String nome;

    @Indexed(unique = true)
    private String crm;

    @Indexed(unique = true)
    private String email;

    private String senhaHash;

    private Set<String> roles;

    // Compatibilidade para autenticação Spring Security
    public String getSenha() {
        return senhaHash;
    }
}
