package com.br.iasaude.saudemais.auth.service;

import org.springframework.http.HttpStatus;

/**
 * Exceção leve para erros de autenticação do gestor.
 * Permite que o controller mantenha o formato de resposta exato esperado pelo frontend.
 */
public class GestorAuthException extends RuntimeException {

    private final HttpStatus status;

    public GestorAuthException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
