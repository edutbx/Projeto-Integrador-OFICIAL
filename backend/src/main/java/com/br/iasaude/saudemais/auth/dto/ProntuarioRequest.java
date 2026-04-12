package com.br.iasaude.saudemais.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProntuarioRequest {

    @NotBlank
    private String resumoProblema;

    private String historicoDoencaAtual;
    private String sintomasRelatados;
    private String alergias;
    private String medicamentosEmUso;
    private String hipoteseDiagnostica;
    private String condutaMedica;
    private String examesSolicitados;
    private String observacoesGerais;
}