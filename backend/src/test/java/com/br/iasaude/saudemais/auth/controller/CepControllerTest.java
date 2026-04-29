package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.ViaCepResponse;
import com.br.iasaude.saudemais.auth.service.JwtService;
import com.br.iasaude.saudemais.auth.service.ViaCepService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.NoSuchElementException;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CepController.class)
@AutoConfigureMockMvc(addFilters = false)
class CepControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ViaCepService viaCepService;

    @MockBean
    private JwtService jwtService;

    @Test
    void buscarCep_quandoSucesso_deveRetornar200() throws Exception {
        ViaCepResponse response = new ViaCepResponse();
        response.setCep("01001-000");
        response.setLogradouro("Praça da Sé");
        when(viaCepService.consultarCep("01001000")).thenReturn(response);

        mockMvc.perform(get("/api/cep/01001000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.cep").value("01001-000"));
    }

    @Test
    void buscarCep_quandoInvalido_deveRetornar400() throws Exception {
        when(viaCepService.consultarCep("x")).thenThrow(new IllegalArgumentException("CEP invalido"));

        mockMvc.perform(get("/api/cep/x"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("CEP invalido"));
    }

    @Test
    void buscarCep_quandoNaoEncontrado_deveRetornar404() throws Exception {
        when(viaCepService.consultarCep("00000000")).thenThrow(new NoSuchElementException("CEP nao encontrado"));

        mockMvc.perform(get("/api/cep/00000000"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("CEP nao encontrado"));
    }

    @Test
    void buscarCep_quandoServicoIndisponivel_deveRetornar502() throws Exception {
        when(viaCepService.consultarCep("01001000")).thenThrow(new IllegalStateException("falha"));

        mockMvc.perform(get("/api/cep/01001000"))
                .andExpect(status().isBadGateway())
                .andExpect(jsonPath("$.error").value("Servico de CEP indisponivel no momento"));
    }
}
