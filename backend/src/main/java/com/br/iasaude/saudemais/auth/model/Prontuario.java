package com.br.iasaude.saudemais.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document("prontuarios")
public class Prontuario {

    @Id
    private String id;

    private String pacienteId;

    // Snapshot básico do paciente para facilitar leitura clínica durante consulta.
    private String pacienteNome;
    private Integer pacienteIdade;
    private String pacienteEndereco;
    private Double pacienteAltura;
    private Double pacientePeso;
    private String medicoCrmReferencia;

    // Conteúdo clínico MVP.
    private String resumoProblema;
    private String historicoDoencaAtual;
    private String sintomasRelatados;
    private String alergias;
    private String medicamentosEmUso;
    private String hipoteseDiagnostica;
    private String condutaMedica;
    private String examesSolicitados;
    private String observacoesGerais;

    // Campo de saída da IA para apoio clínico.
    private String interpretacaoIa;

    private String criadoPor;
    private String criadoEm;
    private String atualizadoPor;
    private String atualizadoEm;
}