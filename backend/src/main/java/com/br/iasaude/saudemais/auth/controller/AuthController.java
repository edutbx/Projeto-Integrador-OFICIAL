package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.*;
import com.br.iasaude.saudemais.auth.service.GestorAuthException;
import com.br.iasaude.saudemais.auth.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserService userService;

    public AuthController(AuthenticationManager authManager, UserService userService) {
        this.authManager = authManager;
        this.userService = userService;
    }

    // ─── Registro ─────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        try {
            return ResponseEntity.ok(userService.registrarMedico(req));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Login médico ─────────────────────────────────────────────────────────

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getCrm(), req.getSenha()));
        AuthResponse auth = userService.gerarTokenMedico(req.getCrm());
        jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", auth.getToken());
        cookie.setPath("/");
        cookie.setMaxAge(60 * 60 * 24);
        response.addCookie(cookie);
        return ResponseEntity.ok(auth);
    }

    // ─── Login gestor ─────────────────────────────────────────────────────────

    /**
     * Delegado ao UserService, que valida email/senha e exige ROLE_ADMIN.
     * O controller cuida apenas do cookie HTTP e do formato de erro.
     */
    @PostMapping("/login-gestor")
    public ResponseEntity<?> loginGestor(@Valid @RequestBody GestorLoginRequest req, HttpServletResponse response) {
        try {
            AuthResponse auth = userService.loginGestor(req);
            jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("gestor_jwt", auth.getToken());
            cookie.setPath("/");
            cookie.setMaxAge(60 * 60 * 24);
            response.addCookie(cookie);
            return ResponseEntity.ok(auth);
        } catch (GestorAuthException e) {
            return ResponseEntity.status(e.getStatus()).body(Map.of("error", e.getMessage()));
        }
    }

    // ─── Área administrativa ──────────────────────────────────────────────────

    /**
     * Listagem de médicos — exige ROLE_ADMIN (protegido via SecurityConfig).
     * URL: GET /api/auth/admin/medicos
     */
    @GetMapping("/admin/medicos")
    public ResponseEntity<?> listarMedicos() {
        return ResponseEntity.ok(userService.listarMedicos());
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@RequestBody DeleteUserRequest request) {
        try {
            userService.deletarUsuario(request.getId());
            return ResponseEntity.ok("Usuário deletado com sucesso!");
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/resetar-senha")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetarSenha(@RequestBody ResetarSenhaRequest request) {
        try {
            String email = userService.resetarSenha(request);
            return ResponseEntity.ok(Map.of("message", "Senha resetada com sucesso pelo admin", "usuario", email));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ─── Sessão ───────────────────────────────────────────────────────────────

    /**
     * Verificação de sessão. Funciona para médico (subject = CRM) e gestor (subject = email).
     * Retorna 200 com dados básicos quando autenticado, 401 caso contrário.
     */
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Nao autenticado"));
        }
        try {
            return ResponseEntity.ok(userService.getDadosUsuario(authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Usuario nao encontrado"));
        }
    }

    @PutMapping("/trocar-senha")
    public ResponseEntity<?> trocarSenha(@RequestBody TrocarSenhaRequest request, Authentication authentication) {
        try {
            userService.trocarSenha(authentication.getName(), request);
            return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", e.getMessage()));
        }
    }
}
