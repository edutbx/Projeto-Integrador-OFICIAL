package com.br.iasaude.saudemais.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetarSenhaRequest {
    private String id;
    private String novaSenha;
}
