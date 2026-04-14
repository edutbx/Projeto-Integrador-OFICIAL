package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.PacienteRequest;
import com.br.iasaude.saudemais.auth.dto.PacienteResponse;
import com.br.iasaude.saudemais.auth.dto.PacienteVinculoMedicoRequest;
import com.br.iasaude.saudemais.auth.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/pacientes")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> listar(@RequestParam(required = false) String q) {
        List<PacienteResponse> pacientes = pacienteService.listar(q);
        return ResponseEntity.ok(Map.of(
                "total", pacientes.size(),
                "pacientes", pacientes
        ));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','USER')")
    public ResponseEntity<?> buscarPorId(@PathVariable String id) {
        try {
            return ResponseEntity.ok(pacienteService.buscarPorId(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> criar(@Valid @RequestBody PacienteRequest request, Authentication authentication) {
        PacienteResponse paciente = pacienteService.criar(request, authentication.getName());
        return ResponseEntity.ok(paciente);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> atualizar(
            @PathVariable String id,
            @Valid @RequestBody PacienteRequest request,
            Authentication authentication
    ) {
        try {
            PacienteResponse paciente = pacienteService.atualizar(id, request, authentication.getName());
            return ResponseEntity.ok(paciente);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/vinculo-medico")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> atualizarVinculo(
            @PathVariable String id,
            @Valid @RequestBody PacienteVinculoMedicoRequest request,
            Authentication authentication
    ) {
        try {
            PacienteResponse paciente = pacienteService.atualizarVinculoMedico(id, request.getMedicoCrm(), authentication.getName());
            return ResponseEntity.ok(paciente);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletar(@PathVariable String id) {
        try {
            pacienteService.deletar(id);
            return ResponseEntity.ok(Map.of("message", "Paciente removido com sucesso"));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
