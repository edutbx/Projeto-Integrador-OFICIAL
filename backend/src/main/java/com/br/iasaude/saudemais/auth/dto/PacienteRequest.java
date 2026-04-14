package com.br.iasaude.saudemais.auth.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class PacienteRequest {

    @NotBlank
    private String nome;

    @NotNull
    @Min(0)
    private Integer idade;

    @NotBlank
    private String endereco;

    @NotNull
    @Positive
    private Double altura;

    @NotNull
    @Positive
    private Double peso;

    private String medicoCrmReferencia;

    private Set<String> medicoCrmsComAcesso;
}
