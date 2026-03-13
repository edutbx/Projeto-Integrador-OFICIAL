package com.br.iasaude.saudemais.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GestorLoginRequest {
    @NotBlank
    private String email;
    @NotBlank
    private String senha;
}
