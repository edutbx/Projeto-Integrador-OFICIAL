package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.ProntuarioRequest;
import com.br.iasaude.saudemais.auth.dto.ProntuarioResponse;
import com.br.iasaude.saudemais.auth.service.ProntuarioService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProntuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProntuarioService prontuarioService;

    @Test
    @WithMockUser(roles = "ADMIN")
    void criarParaPacienteComoAdminDeveRetornar200() throws Exception {
        ProntuarioRequest request = novoRequest();
        ProntuarioResponse response = novoResponse();

        when(prontuarioService.criarParaPaciente(eq("pac-1"), any(ProntuarioRequest.class), eq("user")))
                .thenReturn(response);

        mockMvc.perform(post("/api/prontuarios/paciente/pac-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("pro-1"))
                .andExpect(jsonPath("$.pacienteId").value("pac-1"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void criarParaPacienteComoUserDeveRetornar403() throws Exception {
        mockMvc.perform(post("/api/prontuarios/paciente/pac-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(novoRequest())))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "USER")
    void buscarPorPacienteComoUserDeveRetornar200() throws Exception {
        when(prontuarioService.buscarPorPacienteId("pac-1")).thenReturn(novoResponse());

        mockMvc.perform(get("/api/prontuarios/paciente/pac-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pacienteNome").value("Carolina"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void buscarPorPacienteQuandoNaoExisteDeveRetornar404() throws Exception {
        when(prontuarioService.buscarPorPacienteId("pac-x"))
                .thenThrow(new NoSuchElementException("Prontuário não encontrado para o paciente"));

        mockMvc.perform(get("/api/prontuarios/paciente/pac-x"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "USER")
    void atualizarComoUserDeveRetornar200() throws Exception {
        when(prontuarioService.atualizar(eq("pro-1"), any(ProntuarioRequest.class), eq("user")))
                .thenReturn(novoResponse());

        mockMvc.perform(put("/api/prontuarios/pro-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(novoRequest())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("pro-1"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void interpretarIaComoUserDeveRetornar200ComResposta() throws Exception {
        when(prontuarioService.interpretarComIa("pro-1", "user")).thenReturn("{\"resposta\":\"ok\"}");

        mockMvc.perform(post("/api/prontuarios/pro-1/interpretar-ia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.respostaIA").value("{\"resposta\":\"ok\"}"));
    }

    @Test
    @WithMockUser(roles = "USER")
    void deletarComoUserDeveRetornar403() throws Exception {
        mockMvc.perform(delete("/api/prontuarios/pro-1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deletarComoAdminDeveRetornar200() throws Exception {
        doNothing().when(prontuarioService).deletar("pro-1");

        mockMvc.perform(delete("/api/prontuarios/pro-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Prontuário removido com sucesso"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void deletarComoAdminQuandoNaoExisteDeveRetornar404() throws Exception {
        doThrow(new NoSuchElementException("Prontuário não encontrado")).when(prontuarioService).deletar("pro-x");

        mockMvc.perform(delete("/api/prontuarios/pro-x"))
                .andExpect(status().isNotFound());
    }

    private ProntuarioRequest novoRequest() {
        ProntuarioRequest request = new ProntuarioRequest();
        request.setResumoProblema("Dor abdominal");
        request.setHistoricoDoencaAtual("2 dias");
        request.setSintomasRelatados("Nausea");
        request.setAlergias("Nenhuma");
        request.setMedicamentosEmUso("Dipirona");
        request.setHipoteseDiagnostica("Gastrite");
        request.setCondutaMedica("Hidratação");
        request.setExamesSolicitados("Hemograma");
        request.setObservacoesGerais("Sem febre");
        return request;
    }

    private ProntuarioResponse novoResponse() {
        return new ProntuarioResponse(
                "pro-1",
                "pac-1",
                "Carolina",
                25,
                "Rua das Flores",
                1.63,
                56.0,
                "CRM-123",
                "Resumo",
                "Historico",
                "Sintomas",
                "Alergias",
                "Medicamentos",
                "Hipotese",
                "Conduta",
                "Exames",
                "Obs",
                "{\"resposta\":\"ok\"}",
                "crm-medico",
                "2026-04-12T10:00:00Z"
        );
    }
}
