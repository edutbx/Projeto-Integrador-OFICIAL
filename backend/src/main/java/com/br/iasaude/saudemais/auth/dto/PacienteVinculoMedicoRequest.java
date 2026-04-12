package com.br.iasaude.saudemais.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteVinculoMedicoRequest {

    @NotBlank
    private String medicoCrm;
}