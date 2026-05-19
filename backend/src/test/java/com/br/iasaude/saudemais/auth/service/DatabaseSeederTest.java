package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DatabaseSeederTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @InjectMocks
    private DatabaseSeeder databaseSeeder;

    @Test
    void run_quandoAdminNaoExiste_deveCriarAdminPadrao() {
        when(userRepository.existsByEmail("admin@example.com")).thenReturn(false);
        when(encoder.encode("admin123")).thenReturn("hash");

        databaseSeeder.run();

        verify(userRepository).save(any(Usuario.class));
    }

    @Test
    void run_quandoAdminExiste_naoDeveSalvar() {
        when(userRepository.existsByEmail("admin@example.com")).thenReturn(true);

        databaseSeeder.run();

        verify(userRepository, never()).save(any());
    }
}
