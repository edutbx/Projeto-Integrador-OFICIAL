package com.br.iasaude.saudemais;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import com.br.iasaude.saudemais.auth.repository.NotificacaoRepository;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import com.br.iasaude.saudemais.auth.repository.ProntuarioRepository;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import com.br.iasaude.saudemais.auth.service.DatabaseSeeder;
import com.br.iasaude.saudemais.config.JwtAuthenticationFilter;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE)
@ActiveProfiles("test")
class SaudeApplicationTests {

    @MockBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private PacienteRepository pacienteRepository;

    @MockBean
    private ProntuarioRepository prontuarioRepository;

    @MockBean
    private NotificacaoRepository notificacaoRepository;

    @MockBean
    private DatabaseSeeder databaseSeeder;

    @Test
    void contextLoads() {
    }

}
