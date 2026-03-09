package com.br.iasaude.saudemais.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String sobrenome;

    @NotBlank
    private String cpf;

    @NotBlank
    private String rg;

    @NotBlank
    private String dataNascimento;

    @NotBlank
    private String sexo;

    @NotBlank
    private String crm;

    @NotBlank
    private String especializacao;

    @NotBlank
    private String idGestor;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6)
    private String senha;

    @NotBlank
    private String cep;

    @NotBlank
    private String logradouro;

    @NotBlank
    private String numero;

    private String complemento;

    @NotBlank
    private String cidade;

    @NotBlank
    private String estado;
}
