package com.br.iasaude.saudemais.auth.dto;

import lombok.Getter;

@Getter
public class AuthResponse {

    private String token;
    private String nome;
    private String sobrenome;
    private String cpf;
    private String rg;
    private String dataNascimento;
    private String sexo;
    private String crm;
    private String especializacao;
    private String idGestor;
    private String email;
    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String cidade;
    private String estado;

    public AuthResponse(String token, String nome, String sobrenome, String cpf, String rg, String dataNascimento, String sexo, String crm, String especializacao, String idGestor, String email,
                        String cep, String logradouro, String numero, String complemento, String cidade, String estado) {
        this.token = token;
        this.nome = nome;
        this.sobrenome = sobrenome;
        this.cpf = cpf;
        this.rg = rg;
        this.dataNascimento = dataNascimento;
        this.sexo = sexo;
        this.crm = crm;
        this.especializacao = especializacao;
        this.idGestor = idGestor;
        this.email = email;
        this.cep = cep;
        this.logradouro = logradouro;
        this.numero = numero;
        this.complemento = complemento;
        this.cidade = cidade;
        this.estado = estado;

    }
}
