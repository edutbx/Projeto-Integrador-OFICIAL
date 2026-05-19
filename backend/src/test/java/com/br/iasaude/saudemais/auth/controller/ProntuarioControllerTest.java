package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.ProntuarioRequest;
import com.br.iasaude.saudemais.auth.dto.ProntuarioResponse;
import com.br.iasaude.saudemais.auth.service.JwtService;
import com.br.iasaude.saudemais.auth.service.ProntuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ProntuarioController.class)
@AutoConfigureMockMvc(addFilters = false)
class ProntuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProntuarioService prontuarioService;

    @MockBean
    private JwtService jwtService;

    @Test
    void criarParaPaciente_deveRetornar200() throws Exception {
        ProntuarioRequest req = request();
        when(prontuarioService.criarParaPaciente(eq("p1"), any(ProntuarioRequest.class), eq("admin")))
                .thenReturn(response("pr1", "p1"));

        mockMvc.perform(post("/api/prontuarios/paciente/p1")
                        .principal(authenticationPrincipal("admin"))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("pr1"));
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveRetornar404() throws Exception {
        when(prontuarioService.buscarPorId("x")).thenThrow(new NoSuchElementException());

        mockMvc.perform(get("/api/prontuarios/x"))
                .andExpect(status().isNotFound());
    }

    @Test
    void interpretarIa_quandoErro_deveRetornar400() throws Exception {
        when(prontuarioService.interpretarComIa("pr1", "CRM1"))
                .thenThrow(new IllegalStateException("Erro IA"));

        mockMvc.perform(post("/api/prontuarios/pr1/interpretar-ia")
                        .principal(authenticationPrincipal("CRM1")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.erroIA").value("Erro IA"));
    }

    @Test
    void deletar_quandoExiste_deveRetornar200() throws Exception {
        mockMvc.perform(delete("/api/prontuarios/pr1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Prontuário removido com sucesso"));
    }

    @Test
    void deletar_quandoNaoExiste_deveRetornar404() throws Exception {
        doThrow(new NoSuchElementException()).when(prontuarioService).deletar("prX");

        mockMvc.perform(delete("/api/prontuarios/prX"))
                .andExpect(status().isNotFound());
    }

    private ProntuarioRequest request() {
        ProntuarioRequest req = new ProntuarioRequest();
        req.setResumoProblema("Dor");
        req.setHistoricoDoencaAtual("2 dias");
        return req;
    }

    private ProntuarioResponse response(String id, String pacienteId) {
        return new ProntuarioResponse(id, pacienteId, "Joao", 30, "Rua", 1.7, 70.0, "CRM1",
                "Dor", "Hist", "Sint", "Aler", "Med", "Diag", "Cond", "Ex", "Obs", "", "CRM1", "2026-01-01");
    }

        private Authentication authenticationPrincipal(String username) {
                TestingAuthenticationToken token = new TestingAuthenticationToken(username, null, "ROLE_ADMIN");
                token.setAuthenticated(true);
                return token;
        }
}
