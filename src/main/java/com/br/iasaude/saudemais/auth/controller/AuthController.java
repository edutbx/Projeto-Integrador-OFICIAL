package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.*;
import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import com.br.iasaude.saudemais.auth.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;

    public AuthController(UserRepository userRepository, PasswordEncoder encoder, AuthenticationManager authManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req){
        if (userRepository.existsByCrm(req.getCrm())) {
            return ResponseEntity.badRequest().body(Map.of("error", "CRM já cadastrado"));
        }
        Usuario u = new Usuario();
        u.setNome(req.getNome());
        u.setCrm(req.getCrm());
        u.setEmail(req.getEmail());
        u.setSenhaHash(encoder.encode(req.getSenha()));
        u.setRoles(Set.of("ROLE_USER"));
        userRepository.save(u);
        String token = jwtService.generateToken(u.getCrm(), Map.of("name", u.getNome(), "roles", u.getRoles()));
        return ResponseEntity.ok(new AuthResponse(token, u.getNome(), u.getCrm()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletResponse response) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getCrm(), req.getSenha()));
        var user = userRepository.findByCrm(req.getCrm()).orElseThrow();
        String token = jwtService.generateToken(user.getCrm(), Map.of("name", user.getNome(), "roles", user.getRoles()));
    // Adiciona o JWT como cookie (não HttpOnly para JS ler)
    jakarta.servlet.http.Cookie cookie = new jakarta.servlet.http.Cookie("jwt", token);
    // cookie.setHttpOnly(true); // Removido para JS acessar
    cookie.setPath("/");
    cookie.setMaxAge(60 * 60 * 24); // 1 dia
    response.addCookie(cookie);
        return ResponseEntity.ok(new AuthResponse(token, user.getNome(), user.getCrm()));
    }

    @DeleteMapping("/delete")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@RequestBody DeleteUserRequest request) {
        String id = request.getId();
        Optional<Usuario> user = userRepository.findById(id);
        if (user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("Usuário deletado com sucesso!");
    }

    @PutMapping("/trocar-senha")
    public ResponseEntity<?> trocarSenha(
            @RequestBody TrocarSenhaRequest request,
            Authentication authentication) {

        String crm = authentication.getName(); // crm vem do token
        Usuario user = userRepository.findByCrm(crm)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // validar senha antiga
        if (!encoder.matches(request.getSenhaAntiga(), user.getSenhaHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Senha antiga incorreta"));
        }

        // atualizar senha com hash
        user.setSenhaHash(encoder.encode(request.getNovaSenha()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Senha alterada com sucesso"));
    }

    @PutMapping("/resetar-senha")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetarSenha(@RequestBody ResetarSenhaRequest request) {
        var user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        user.setSenhaHash(encoder.encode(request.getNovaSenha()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "message", "Senha resetada com sucesso pelo admin",
                "usuario", user.getEmail()
        ));
    }
}
