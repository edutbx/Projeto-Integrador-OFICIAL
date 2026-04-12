package com.br.iasaude.saudemais.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProntuarioResponse {
    private String id;
    private String pacienteId;
    private String pacienteNome;
    private Integer pacienteIdade;
    private String pacienteEndereco;
    private Double pacienteAltura;
    private Double pacientePeso;
    private String medicoCrmReferencia;

    private String resumoProblema;
    private String historicoDoencaAtual;
    private String sintomasRelatados;
    private String alergias;
    private String medicamentosEmUso;
    private String hipoteseDiagnostica;
    private String condutaMedica;
    private String examesSolicitados;
    private String observacoesGerais;

    private String interpretacaoIa;
    private String atualizadoPor;
    private String atualizadoEm;
}