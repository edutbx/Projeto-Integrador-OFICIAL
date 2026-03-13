package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.*;
import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service responsável por toda a lógica de negócio relacionada a usuários.
 *
 * Cobre médico e gestor com a mesma entidade Usuario, diferenciados por roles:
 *   - médico  → ROLE_USER  (subject do JWT = CRM)
 *   - gestor  → ROLE_ADMIN (subject do JWT = email)
 *
 * Os controllers delegam para cá e cuidam apenas do mapeamento HTTP.
 */
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder encoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    // ─── Médico: registro ─────────────────────────────────────────────────────

    /**
     * Cria um novo médico e retorna o AuthResponse com o token JWT.
     * Lança IllegalArgumentException se o CRM já estiver cadastrado.
     */
    public AuthResponse registrarMedico(RegisterRequest req) {
        if (userRepository.existsByCrm(req.getCrm())) {
            throw new IllegalArgumentException("CRM já cadastrado");
        }
        Usuario u = new Usuario();
        u.setNome(req.getNome());
        u.setSobrenome(req.getSobrenome());
        u.setCrm(req.getCrm());
        u.setCpf(req.getCpf());
        u.setRg(req.getRg());
        u.setDataNascimento(req.getDataNascimento());
        u.setSexo(req.getSexo());
        u.setEspecializacao(req.getEspecializacao());
        u.setIdGestor(req.getIdGestor());
        u.setEmail(req.getEmail());
        u.setCep(req.getCep());
        u.setLogradouro(req.getLogradouro());
        u.setNumero(req.getNumero());
        u.setComplemento(req.getComplemento());
        u.setCidade(req.getCidade());
        u.setEstado(req.getEstado());
        u.setSenhaHash(encoder.encode(req.getSenha()));
        u.setRoles(Set.of("ROLE_USER"));
        userRepository.save(u);
        String token = jwtService.generateToken(u.getCrm(),
                Map.of("name", u.getNome(), "roles", u.getRoles()));
        return buildAuthResponse(token, u);
    }

    // ─── Médico: geração de token após autenticação ───────────────────────────

    /**
     * Gera JWT para o médico após o AuthenticationManager já ter validado as credenciais.
     * Chamado pelo controller logo após authManager.authenticate().
     */
    public AuthResponse gerarTokenMedico(String crm) {
        Usuario user = userRepository.findByCrm(crm).orElseThrow();
        String token = jwtService.generateToken(user.getCrm(),
                Map.of("name", user.getNome(), "roles", user.getRoles()));
        return buildAuthResponse(token, user);
    }

    // ─── Gestor: autenticação ─────────────────────────────────────────────────

    /**
     * Autentica um gestor via email + senha. Exige ROLE_ADMIN.
     * Lança GestorAuthException para preservar o formato de erro esperado pelo frontend.
     */
    public AuthResponse loginGestor(GestorLoginRequest req) {
        Usuario user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new GestorAuthException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!encoder.matches(req.getSenha(), user.getSenhaHash())) {
            throw new GestorAuthException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        if (user.getRoles() == null || !user.getRoles().contains("ROLE_ADMIN")) {
            throw new GestorAuthException(HttpStatus.FORBIDDEN, "Acesso não autorizado para gestores");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                Map.of(
                        "name",  user.getNome() != null ? user.getNome() : "",
                        "roles", user.getRoles()
                )
        );
        return buildAuthResponse(token, user);
    }

    // ─── Listagem de médicos ──────────────────────────────────────────────────

    /**
     * Retorna médicos (ROLE_USER sem ROLE_ADMIN) e contagem total.
     * Usado pela área do gestor.
     */
    public Map<String, Object> listarMedicos() {
        List<Usuario> candidatos = userRepository.findByRolesContaining("ROLE_USER");

        List<Map<String, String>> medicos = candidatos.stream()
                .filter(u -> u.getRoles() != null && !u.getRoles().contains("ROLE_ADMIN"))
                .map(u -> Map.of(
                        "id",             u.getId()             != null ? u.getId()             : "",
                        "nome",           u.getNome()            != null ? u.getNome()            : "",
                        "sobrenome",      u.getSobrenome()       != null ? u.getSobrenome()       : "",
                        "crm",            u.getCrm()             != null ? u.getCrm()             : "",
                        "especializacao", u.getEspecializacao()  != null ? u.getEspecializacao()  : "",
                        "email",          u.getEmail()           != null ? u.getEmail()           : ""
                ))
                .collect(Collectors.toList());

        return Map.of(
                "totalMedicosAtivos", medicos.size(),
                "medicos", medicos
        );
    }

    // ─── Dados do usuário autenticado ─────────────────────────────────────────

    /**
     * Retorna dados básicos do usuário autenticado.
     * O subject do JWT pode ser CRM (médico) ou email (gestor) — ambos suportados.
     */
    public Map<String, Object> getDadosUsuario(String subject) {
        Usuario u = findBySubject(subject);
        return Map.of(
                "nome",  u.getNome()  != null ? u.getNome()  : "",
                "crm",   u.getCrm()   != null ? u.getCrm()   : "",
                "email", u.getEmail() != null ? u.getEmail() : ""
        );
    }

    // ─── Senha ────────────────────────────────────────────────────────────────

    /**
     * Altera a senha do usuário autenticado.
     * Suporta médico (subject = CRM) e gestor (subject = email).
     * Lança IllegalArgumentException se a senha antiga estiver incorreta.
     */
    public void trocarSenha(String subject, TrocarSenhaRequest request) {
        Usuario user = findBySubject(subject);
        if (!encoder.matches(request.getSenhaAntiga(), user.getSenhaHash())) {
            throw new IllegalArgumentException("Senha antiga incorreta");
        }
        user.setSenhaHash(encoder.encode(request.getNovaSenha()));
        userRepository.save(user);
    }

    /**
     * Reseta a senha de qualquer usuário pelo ID (operação administrativa).
     * Retorna o email do usuário afetado para inclusão na resposta.
     */
    public String resetarSenha(ResetarSenhaRequest request) {
        Usuario user = userRepository.findById(request.getId())
                .orElseThrow(() -> new NoSuchElementException("Usuário não encontrado"));
        user.setSenhaHash(encoder.encode(request.getNovaSenha()));
        userRepository.save(user);
        return user.getEmail();
    }

    // ─── Exclusão ─────────────────────────────────────────────────────────────

    /**
     * Remove um usuário pelo ID. Lança NoSuchElementException se não encontrado.
     */
    public void deletarUsuario(String id) {
        if (!userRepository.existsById(id)) {
            throw new NoSuchElementException("Usuário não encontrado");
        }
        userRepository.deleteById(id);
    }

    // ─── Helpers privados ─────────────────────────────────────────────────────

    /**
     * Busca usuário por CRM (médico) ou email (gestor).
     * Necessário porque o subject do JWT varia por tipo de usuário.
     */
    private Usuario findBySubject(String subject) {
        return userRepository.findByCrm(subject)
                .or(() -> userRepository.findByEmail(subject))
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    /**
     * Constrói AuthResponse com null-safety em todos os campos do Usuario.
     * Centraliza a criação para evitar repetição nos métodos de login/registro.
     */
    private AuthResponse buildAuthResponse(String token, Usuario u) {
        return new AuthResponse(
                token,
                u.getNome()           != null ? u.getNome()           : "",
                u.getSobrenome()      != null ? u.getSobrenome()      : "",
                u.getCpf()            != null ? u.getCpf()            : "",
                u.getRg()             != null ? u.getRg()             : "",
                u.getDataNascimento() != null ? u.getDataNascimento() : "",
                u.getSexo()           != null ? u.getSexo()           : "",
                u.getCrm()            != null ? u.getCrm()            : "",
                u.getEspecializacao() != null ? u.getEspecializacao() : "",
                u.getIdGestor()       != null ? u.getIdGestor()       : "",
                u.getEmail()          != null ? u.getEmail()          : "",
                u.getCep()            != null ? u.getCep()            : "",
                u.getLogradouro()     != null ? u.getLogradouro()     : "",
                u.getNumero()         != null ? u.getNumero()         : "",
                u.getComplemento()    != null ? u.getComplemento()    : "",
                u.getCidade()         != null ? u.getCidade()         : "",
                u.getEstado()         != null ? u.getEstado()         : ""
        );
    }
}
