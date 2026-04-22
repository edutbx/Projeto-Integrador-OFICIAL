package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.model.Notificacao;
import com.br.iasaude.saudemais.auth.repository.NotificacaoRepository;
import com.br.iasaude.saudemais.auth.service.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NotificacaoController.class)
@AutoConfigureMockMvc(addFilters = false)
class NotificacaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private NotificacaoRepository repository;

    @MockBean
    private JwtService jwtService;

    @Test
    void criar_deveRetornarOkTrue() throws Exception {
        when(repository.save(any(Notificacao.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(post("/api/notificacoes")
                        .contentType("application/json")
                        .content("{\"nomeRemetente\":\"Ana\",\"emailRemetente\":\"ana@a.com\",\"crm\":\"CRM1\",\"mensagem\":\"oi\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true));
    }

    @Test
    void listar_deveRetornarLista() throws Exception {
        Notificacao n = new Notificacao();
        n.setId("1");
        n.setMensagem("msg");
        n.setDataHora(LocalDateTime.now());
        when(repository.findAllByOrderByDataHoraDesc()).thenReturn(List.of(n));

        mockMvc.perform(get("/api/notificacoes/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"));
    }

    @Test
    void contarNaoLidas_deveRetornarValor() throws Exception {
        when(repository.countByLidaFalse()).thenReturn(3L);

        mockMvc.perform(get("/api/notificacoes/admin/count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.naoLidas").value(3));
    }

    @Test
    void marcarLida_quandoExiste_deveRetornarOk() throws Exception {
        Notificacao n = new Notificacao();
        n.setId("1");
        when(repository.findById("1")).thenReturn(Optional.of(n));
        when(repository.save(any(Notificacao.class))).thenAnswer(inv -> inv.getArgument(0));

        mockMvc.perform(put("/api/notificacoes/admin/1/lida"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ok").value(true));
    }
}
