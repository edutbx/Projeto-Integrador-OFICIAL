package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService customUserDetailsService;

    @Test
    void loadUserByUsername_quandoExiste_deveRetornarUserDetails() {
        Usuario user = new Usuario();
        user.setCrm("CRM1");
        user.setSenhaHash("hash");
        user.setRoles(Set.of("ROLE_USER"));
        when(userRepository.findByCrm("CRM1")).thenReturn(Optional.of(user));

        var details = customUserDetailsService.loadUserByUsername("CRM1");

        assertEquals("CRM1", details.getUsername());
        assertEquals("hash", details.getPassword());
        assertEquals(1, details.getAuthorities().size());
    }

    @Test
    void loadUserByUsername_quandoNaoExiste_deveLancar() {
        when(userRepository.findByCrm("CRMX")).thenReturn(Optional.empty());

        assertThrows(UsernameNotFoundException.class,
                () -> customUserDetailsService.loadUserByUsername("CRMX"));
    }
}
