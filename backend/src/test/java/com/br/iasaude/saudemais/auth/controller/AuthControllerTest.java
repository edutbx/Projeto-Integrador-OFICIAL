package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.AuthResponse;
import com.br.iasaude.saudemais.auth.dto.GestorLoginRequest;
import com.br.iasaude.saudemais.auth.dto.LoginRequest;
import com.br.iasaude.saudemais.auth.dto.RegisterRequest;
import com.br.iasaude.saudemais.auth.dto.ResetarSenhaRequest;
import com.br.iasaude.saudemais.auth.dto.TrocarSenhaRequest;
import com.br.iasaude.saudemais.auth.service.GestorAuthException;
import com.br.iasaude.saudemais.auth.service.JwtService;
import com.br.iasaude.saudemais.auth.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.NoSuchElementException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.cookie;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthenticationManager authManager;

    @MockBean
    private UserService userService;

    @MockBean
    private JwtService jwtService;

    @Test
    void register_deveRetornar200() throws Exception {
        RegisterRequest req = new RegisterRequest();
        req.setNome("Ana");
        req.setSobrenome("Silva");
        req.setCpf("123");
        req.setRg("456");
        req.setDataNascimento("2000-01-01");
        req.setSexo("F");
        req.setCrm("CRM1");
        req.setEspecializacao("Clinica");
        req.setIdGestor("g1");
        req.setEmail("ana@a.com");
        req.setSenha("123456");
        req.setCep("00000-000");
        req.setLogradouro("Rua");
        req.setNumero("1");
        req.setCidade("Cidade");
        req.setEstado("SP");

        when(userService.registrarMedico(any(RegisterRequest.class))).thenReturn(authResponse("jwt"));

        mockMvc.perform(post("/api/auth/register")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt"));
    }

    @Test
    void login_deveSetarCookieJwt() throws Exception {
        LoginRequest req = new LoginRequest();
        req.setCrm("CRM1");
        req.setSenha("123");

        Authentication auth = new UsernamePasswordAuthenticationToken("CRM1", "123");
        when(authManager.authenticate(any())).thenReturn(auth);
        when(userService.gerarTokenMedico("CRM1")).thenReturn(authResponse("jwt-med"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(cookie().value("jwt", "jwt-med"));
    }

    @Test
    void loginGestor_quandoErro_deveRetornarStatusDoService() throws Exception {
        GestorLoginRequest req = new GestorLoginRequest();
        req.setEmail("admin@a.com");
        req.setSenha("123");

        when(userService.loginGestor(any(GestorLoginRequest.class)))
                .thenThrow(new GestorAuthException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        mockMvc.perform(post("/api/auth/login-gestor")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Credenciais inválidas"));
    }

    @Test
    void me_quandoSemAutenticacao_deveRetornar401() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Nao autenticado"));
    }

    @Test
    void me_quandoAutenticado_deveRetornarDados() throws Exception {
        when(userService.getDadosUsuario("CRM1")).thenReturn(Map.of("nome", "Ana", "crm", "CRM1", "email", "a@a.com"));

        mockMvc.perform(get("/api/auth/me")
                        .principal(authenticationPrincipal("CRM1")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Ana"));
    }

    @Test
    void deleteUser_quandoNaoExiste_deveRetornar404() throws Exception {
        doThrow(new NoSuchElementException()).when(userService).deletarUsuario(eq("x"));

        mockMvc.perform(delete("/api/auth/delete")
                        .contentType("application/json")
                        .content("{\"id\":\"x\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void resetarSenha_quandoExiste_deveRetornar200() throws Exception {
        ResetarSenhaRequest req = new ResetarSenhaRequest();
        req.setId("1");
        req.setNovaSenha("new");
        when(userService.resetarSenha(any(ResetarSenhaRequest.class))).thenReturn("user@a.com");

        mockMvc.perform(put("/api/auth/resetar-senha")
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario").value("user@a.com"));
    }

    @Test
    void trocarSenha_quandoSenhaInvalida_deveRetornar400() throws Exception {
        TrocarSenhaRequest req = new TrocarSenhaRequest();
        req.setSenhaAntiga("old");
        req.setNovaSenha("new");
        doThrow(new IllegalArgumentException("Senha antiga incorreta"))
                .when(userService).trocarSenha(eq("CRM1"), any(TrocarSenhaRequest.class));

        mockMvc.perform(put("/api/auth/trocar-senha")
                                                .principal(authenticationPrincipal("CRM1"))
                        .contentType("application/json")
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Senha antiga incorreta"));
    }

        private Authentication authenticationPrincipal(String username) {
                TestingAuthenticationToken token = new TestingAuthenticationToken(username, null, "ROLE_USER");
                token.setAuthenticated(true);
                return token;
        }

    private AuthResponse authResponse(String token) {
        return new AuthResponse(token, "Ana", "Silva", "", "", "", "", "CRM1", "", "", "ana@a.com", "", "", "", "", "", "");
    }
}
