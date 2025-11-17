package com.br.iasaude.saudemais.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank
    private String crm;

    @NotBlank
    private String senha;
}
