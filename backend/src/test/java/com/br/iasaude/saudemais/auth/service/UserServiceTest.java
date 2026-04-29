package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.GestorLoginRequest;
import com.br.iasaude.saudemais.auth.dto.RegisterRequest;
import com.br.iasaude.saudemais.auth.dto.ResetarSenhaRequest;
import com.br.iasaude.saudemais.auth.dto.TrocarSenhaRequest;
import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder encoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private UserService userService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setup() {
        registerRequest = new RegisterRequest();
        registerRequest.setNome("Ana");
        registerRequest.setSobrenome("Silva");
        registerRequest.setCpf("123");
        registerRequest.setRg("456");
        registerRequest.setDataNascimento("2000-01-01");
        registerRequest.setSexo("F");
        registerRequest.setCrm("CRM123");
        registerRequest.setEspecializacao("Clinica");
        registerRequest.setIdGestor("g1");
        registerRequest.setEmail("ana@teste.com");
        registerRequest.setSenha("segredo");
        registerRequest.setCep("00000-000");
        registerRequest.setLogradouro("Rua A");
        registerRequest.setNumero("1");
        registerRequest.setComplemento("Casa");
        registerRequest.setCidade("Cidade");
        registerRequest.setEstado("SP");
    }

    @Test
    void registrarMedico_deveCriarUsuarioERetornarAuth() {
        when(userRepository.existsByCrm("CRM123")).thenReturn(false);
        when(encoder.encode("segredo")).thenReturn("hash");
        when(jwtService.generateToken(eq("CRM123"), any())).thenReturn("token");

        var response = userService.registrarMedico(registerRequest);

        assertEquals("token", response.getToken());
        assertEquals("Ana", response.getNome());
        assertEquals("CRM123", response.getCrm());
        verify(userRepository).save(any(Usuario.class));
    }

    @Test
    void registrarMedico_quandoCrmExistente_deveLancarErro() {
        when(userRepository.existsByCrm("CRM123")).thenReturn(true);

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> userService.registrarMedico(registerRequest));

        assertEquals("CRM já cadastrado", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void gerarTokenMedico_deveRetornarAuthResponse() {
        Usuario usuario = criarUsuario("1", "CRM123", "medico@a.com", Set.of("ROLE_USER"));
        when(userRepository.findByCrm("CRM123")).thenReturn(Optional.of(usuario));
        when(jwtService.generateToken(eq("CRM123"), any())).thenReturn("jwt");

        var response = userService.gerarTokenMedico("CRM123");

        assertEquals("jwt", response.getToken());
        assertEquals("CRM123", response.getCrm());
    }

    @Test
    void loginGestor_quandoCredenciaisValidas_deveRetornarToken() {
        GestorLoginRequest request = new GestorLoginRequest();
        request.setEmail("admin@a.com");
        request.setSenha("123");
        Usuario admin = criarUsuario("1", null, "admin@a.com", Set.of("ROLE_ADMIN"));
        admin.setSenhaHash("hash");

        when(userRepository.findByEmail("admin@a.com")).thenReturn(Optional.of(admin));
        when(encoder.matches("123", "hash")).thenReturn(true);
        when(jwtService.generateToken(eq("admin@a.com"), any())).thenReturn("jwt-admin");

        var response = userService.loginGestor(request);

        assertEquals("jwt-admin", response.getToken());
        assertEquals("admin@a.com", response.getEmail());
    }

    @Test
    void loginGestor_quandoSenhaInvalida_deveLancarUnauthorized() {
        GestorLoginRequest request = new GestorLoginRequest();
        request.setEmail("admin@a.com");
        request.setSenha("errada");
        Usuario admin = criarUsuario("1", null, "admin@a.com", Set.of("ROLE_ADMIN"));
        admin.setSenhaHash("hash");

        when(userRepository.findByEmail("admin@a.com")).thenReturn(Optional.of(admin));
        when(encoder.matches("errada", "hash")).thenReturn(false);

        GestorAuthException ex = assertThrows(GestorAuthException.class, () -> userService.loginGestor(request));

        assertEquals(HttpStatus.UNAUTHORIZED, ex.getStatus());
    }

    @Test
    void loginGestor_quandoUsuarioNaoAdmin_deveLancarForbidden() {
        GestorLoginRequest request = new GestorLoginRequest();
        request.setEmail("med@a.com");
        request.setSenha("123");
        Usuario user = criarUsuario("1", "CRM1", "med@a.com", Set.of("ROLE_USER"));
        user.setSenhaHash("hash");

        when(userRepository.findByEmail("med@a.com")).thenReturn(Optional.of(user));
        when(encoder.matches("123", "hash")).thenReturn(true);

        GestorAuthException ex = assertThrows(GestorAuthException.class, () -> userService.loginGestor(request));

        assertEquals(HttpStatus.FORBIDDEN, ex.getStatus());
    }

    @Test
    void listarMedicos_deveFiltrarAdmins() {
        Usuario medico = criarUsuario("m1", "CRM1", "m@a.com", Set.of("ROLE_USER"));
        Usuario adminUser = criarUsuario("a1", "CRM2", "a@a.com", Set.of("ROLE_USER", "ROLE_ADMIN"));
        when(userRepository.findByRolesContaining("ROLE_USER")).thenReturn(List.of(medico, adminUser));

        Map<String, Object> response = userService.listarMedicos();

        assertEquals(1, response.get("totalMedicosAtivos"));
        assertTrue(((List<?>) response.get("medicos")).size() == 1);
    }

    @Test
    void getDadosUsuario_deveBuscarPorCrmOuEmail() {
        Usuario medico = criarUsuario("1", "CRM123", "x@a.com", Set.of("ROLE_USER"));
        when(userRepository.findByCrm("CRM123")).thenReturn(Optional.of(medico));

        Map<String, Object> dados = userService.getDadosUsuario("CRM123");

        assertEquals("Ana", dados.get("nome"));
        assertEquals("CRM123", dados.get("crm"));
    }

    @Test
    void trocarSenha_quandoSenhaAntigaValida_deveSalvarNovaSenha() {
        TrocarSenhaRequest request = new TrocarSenhaRequest();
        request.setSenhaAntiga("old");
        request.setNovaSenha("new");
        Usuario usuario = criarUsuario("1", "CRM123", "x@a.com", Set.of("ROLE_USER"));
        usuario.setSenhaHash("oldHash");

        when(userRepository.findByCrm("CRM123")).thenReturn(Optional.of(usuario));
        when(encoder.matches("old", "oldHash")).thenReturn(true);
        when(encoder.encode("new")).thenReturn("newHash");

        userService.trocarSenha("CRM123", request);

        assertEquals("newHash", usuario.getSenhaHash());
        verify(userRepository).save(usuario);
    }

    @Test
    void resetarSenha_deveRetornarEmail() {
        ResetarSenhaRequest request = new ResetarSenhaRequest();
        request.setId("1");
        request.setNovaSenha("123");
        Usuario usuario = criarUsuario("1", "CRM123", "x@a.com", Set.of("ROLE_USER"));
        when(userRepository.findById("1")).thenReturn(Optional.of(usuario));
        when(encoder.encode("123")).thenReturn("hash");

        String email = userService.resetarSenha(request);

        assertEquals("x@a.com", email);
        assertEquals("hash", usuario.getSenhaHash());
        verify(userRepository).save(usuario);
    }

    @Test
    void deletarUsuario_quandoExiste_deveRemover() {
        when(userRepository.existsById("1")).thenReturn(true);

        userService.deletarUsuario("1");

        verify(userRepository).deleteById("1");
    }

    private Usuario criarUsuario(String id, String crm, String email, Set<String> roles) {
        Usuario u = new Usuario();
        u.setId(id);
        u.setNome("Ana");
        u.setSobrenome("Silva");
        u.setCrm(crm);
        u.setEmail(email);
        u.setRoles(roles);
        return u;
    }
}
