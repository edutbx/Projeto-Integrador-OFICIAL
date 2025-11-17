package com.br.iasaude.saudemais.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TrocarSenhaRequest {
    private String senhaAntiga;
    private String novaSenha;
}
