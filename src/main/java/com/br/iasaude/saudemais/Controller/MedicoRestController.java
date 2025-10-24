package com.br.iasaude.saudemais.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api")
public class MedicoRestController {
    @GetMapping("/medico")
    public String medico() {
        return "Acesso autorizado ao endpoint REST /api/medico";
    }
}
