package com.br.iasaude.saudemais.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Set;

@Getter
@AllArgsConstructor
public class PacienteResponse {
    private String id;
    private String nome;
    private Integer idade;
    private String endereco;
    private Double altura;
    private Double peso;
    private String medicoCrmReferencia;
    private Set<String> medicoCrmsComAcesso;
    private String prontuarioAtualId;
    private String ultimaAlteracaoProntuarioPorCrm;
    private String ultimaAlteracaoProntuarioEm;
}