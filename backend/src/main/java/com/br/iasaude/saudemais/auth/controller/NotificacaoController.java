package com.br.iasaude.saudemais.auth.controller;

import com.br.iasaude.saudemais.auth.dto.NotificacaoRequest;
import com.br.iasaude.saudemais.auth.model.Notificacao;
import com.br.iasaude.saudemais.auth.repository.NotificacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/notificacoes")
public class NotificacaoController {

    @Autowired
    private NotificacaoRepository repository;

    /** Endpoint público: médico envia solicitação de cadastro */
    @PostMapping
    public ResponseEntity<?> criar(@RequestBody NotificacaoRequest req) {
        Notificacao n = new Notificacao();
        n.setNomeRemetente(req.getNomeRemetente());
        n.setEmailRemetente(req.getEmailRemetente());
        n.setCrm(req.getCrm());
        n.setMensagem(req.getMensagem());
        n.setDataHora(LocalDateTime.now());
        repository.save(n);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    /** Lista todas as notificações (admin) */
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(repository.findAllByOrderByDataHoraDesc());
    }

    /** Conta notificações não lidas (admin) */
    @GetMapping("/admin/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> contarNaoLidas() {
        return ResponseEntity.ok(Map.of("naoLidas", repository.countByLidaFalse()));
    }

    /** Marca uma notificação como lida (admin) */
    @PutMapping("/admin/{id}/lida")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> marcarLida(@PathVariable String id) {
        return repository.findById(id).map(n -> {
            n.setLida(true);
            repository.save(n);
            return ResponseEntity.ok(Map.of("ok", true));
        }).orElse(ResponseEntity.notFound().build());
    }
}
