package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.ProntuarioRequest;
import com.br.iasaude.saudemais.auth.dto.ProntuarioResponse;
import com.br.iasaude.saudemais.auth.service.ProntuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/prontuarios")
public class ProntuarioController {

    private final ProntuarioService prontuarioService;

    public ProntuarioController(ProntuarioService prontuarioService) {
        this.prontuarioService = prontuarioService;
    }

    @PostMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> criarParaPaciente(
            @PathVariable String pacienteId,
            @Valid @RequestBody ProntuarioRequest request,
            Authentication authentication
    ) {
        try {
            ProntuarioResponse response = prontuarioService.criarParaPaciente(pacienteId, request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/paciente/{pacienteId}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorPacienteId(@PathVariable String pacienteId) {
        try {
            return ResponseEntity.ok(prontuarioService.buscarPorPacienteId(pacienteId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        try {
            return ResponseEntity.ok(prontuarioService.buscarPorId(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> atualizar(
            @PathVariable String id,
            @Valid @RequestBody ProntuarioRequest request,
            Authentication authentication
    ) {
        try {
            ProntuarioResponse response = prontuarioService.atualizar(id, request, authentication.getName());
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/interpretar-ia")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> interpretarIa(@PathVariable String id, Authentication authentication) {
        try {
            String resposta = prontuarioService.interpretarComIa(id, authentication.getName());
            return ResponseEntity.ok(Map.of("respostaIA", resposta));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("erroIA", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable String id) {
        try {
            prontuarioService.deletar(id);
            return ResponseEntity.ok(Map.of("message", "Prontuário removido com sucesso"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
