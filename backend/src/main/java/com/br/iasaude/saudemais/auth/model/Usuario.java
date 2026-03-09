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

    private String sobrenome;

    private String cpf;

    private String rg;

    private String dataNascimento;

    private String sexo;

    @Indexed(unique = true)
    private String crm;

    private String especializacao;

    private String idGestor;

    @Indexed(unique = true)
    private String email;

    private String cep;

    private String logradouro;

    private String numero;

    private String complemento;

    private String cidade;

    private String estado;

    private String senhaHash;

    private Set<String> roles;

    // Compatibilidade para autenticação Spring Security
    public String getSenha() {
        return senhaHash;
    }
}

//Usuario.java          ← salva no banco
//RegisterRequest.java  ← recebe do frontend
//AuthResponse.java     ← devolve para o frontend
//AuthController.java   ← conecta tudo no backend
//types/index.ts        ← tipo TypeScript
//authService.ts        ← envia e salva localmente
//BodyCadastro.tsx      ← o usuário digita na tela
