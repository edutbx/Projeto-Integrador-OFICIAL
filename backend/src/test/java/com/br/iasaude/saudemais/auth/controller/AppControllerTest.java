package com.br.iasaude.saudemais.auth.controller;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class AppControllerTest {

    private final appController controller = new appController();

    @Test
    void todasAsRotasDevemFazerForwardParaRaiz() {
        assertEquals("forward:/", controller.home());
        assertEquals("forward:/", controller.login());
        assertEquals("forward:/", controller.gestor());
        assertEquals("forward:/", controller.medico());
        assertEquals("forward:/", controller.prontuario());
        assertEquals("forward:/", controller.novaConsulta());
        assertEquals("forward:/", controller.sobreNos());
        assertEquals("forward:/", controller.servicos());
        assertEquals("forward:/", controller.contato());
        assertEquals("forward:/", controller.entrar());
        assertEquals("forward:/", controller.loginGestor());
        assertEquals("forward:/", controller.gestorMedicos());
        assertEquals("forward:/", controller.gestorPacientes());
        assertEquals("forward:/", controller.gestorPacienteProntuario());
        assertEquals("forward:/", controller.medicoPacientes());
    }
}
