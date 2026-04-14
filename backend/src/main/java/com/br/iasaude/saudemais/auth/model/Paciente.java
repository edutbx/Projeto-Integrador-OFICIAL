package com.br.iasaude.saudemais.auth.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Document("pacientes")
public class Paciente {

    @Id
    private String id;

    private String nome;

    private Integer idade;

    private String endereco;

    private Double altura;

    private Double peso;

    // Vínculo principal já preparado para restringir acesso por consulta no futuro.
    private String medicoCrmReferencia;

    // Lista de médicos com potencial acesso ao paciente (futuro: derivar de consultas).
    private Set<String> medicoCrmsComAcesso = new LinkedHashSet<>();

    // Campos de preparo para o próximo CRUD de prontuário.
    private String prontuarioAtualId;
    private String ultimaAlteracaoProntuarioPorCrm;
    private String ultimaAlteracaoProntuarioEm;

    private String criadoPor;
    private String criadoEm;
    private String atualizadoPor;
    private String atualizadoEm;
}
