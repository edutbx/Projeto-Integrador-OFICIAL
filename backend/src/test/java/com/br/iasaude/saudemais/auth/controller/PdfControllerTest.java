package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.mock.web.MockMultipartFile;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PdfController.class)
@AutoConfigureMockMvc(addFilters = false)
class PdfControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private JwtService jwtService;

    @Test
    void interpretarPdf_quandoArquivoNaoPdf_deveRetornar400() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "arquivo.txt",
                "text/plain",
                "conteudo".getBytes()
        );

        mockMvc.perform(multipart("/api/interpretar-pdf").file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Arquivo inválido"));
    }
}
