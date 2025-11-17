package com.br.iasaude.saudemais.auth.dto;

import lombok.Getter;

@Getter
public class AuthResponse {

    private String token;
    private String nome;
    private String email;

    public AuthResponse(String token, String nome, String email) {
        this.token = token;
        this.nome = nome;
        this.email = email;
    }
}
