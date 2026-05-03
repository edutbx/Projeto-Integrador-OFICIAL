package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.PacienteRequest;
import com.br.iasaude.saudemais.auth.dto.PacienteResponse;
import com.br.iasaude.saudemais.auth.service.JwtService;
import com.br.iasaude.saudemais.auth.service.PacienteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

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

@WebMvcTest(PacienteController.class)
@AutoConfigureMockMvc(addFilters = false)
class PacienteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PacienteService pacienteService;

    @MockBean
    private JwtService jwtService;

    @Test
    void listar_deveRetornarTotalELista() throws Exception {
        when(pacienteService.listar("jo")).thenReturn(List.of(response("1", "Joao")));

        mockMvc.perform(get("/api/pacientes").param("q", "jo"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(1))
                .andExpect(jsonPath("$.pacientes[0].nome").value("Joao"));
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveRetornar404() throws Exception {
        when(pacienteService.buscarPorId("x")).thenThrow(new NoSuchElementException());

        mockMvc.perform(get("/api/pacientes/x"))
                .andExpect(status().isNotFound());
    }

    @Test
    void criar_deveRetornar200() throws Exception {
        PacienteRequest req = request();
        when(pacienteService.criar(any(PacienteRequest.class), eq("admin"))).thenReturn(response("1", "Joao"));

        mockMvc.perform(post("/api/pacientes")
                .principal(authenticationPrincipal("admin"))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"));
    }

    @Test
    void atualizarVinculo_quandoNaoExiste_deveRetornar404() throws Exception {
        doThrow(new NoSuchElementException()).when(pacienteService)
                .atualizarVinculoMedico(eq("1"), eq("CRM9"), eq("admin"));

        mockMvc.perform(put("/api/pacientes/1/vinculo-medico")
                .principal(authenticationPrincipal("admin"))
                        .contentType("application/json")
                        .content("{\"medicoCrm\":\"CRM9\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void deletar_quandoExiste_deveRetornar200() throws Exception {
        mockMvc.perform(delete("/api/pacientes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Paciente removido com sucesso"));
    }

    private PacienteResponse response(String id, String nome) {
        return new PacienteResponse(id, "000.000.000-00", nome, 30, "Rua", 1.7, 70.0, "CRM1", Set.of("CRM1"), null, null, null);
    }

    private PacienteRequest request() {
        PacienteRequest req = new PacienteRequest();
        req.setCpf("52998224725");
        req.setNome("Joao");
        req.setIdade(30);
        req.setEndereco("Rua");
        req.setAltura(1.7);
        req.setPeso(70.0);
        req.setMedicoCrmReferencia("CRM1");
        req.setMedicoCrmsComAcesso(Set.of("CRM1"));
        return req;
    }

    private Authentication authenticationPrincipal(String username) {
        TestingAuthenticationToken token = new TestingAuthenticationToken(username, null, "ROLE_ADMIN");
        token.setAuthenticated(true);
        return token;
    }
}
