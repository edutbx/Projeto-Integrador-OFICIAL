package com.br.iasaude.saudemais.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class appController {
    @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/gestor")
    public String gestor() {
        return "gestor";
    }

    @GetMapping("/medico")
    public String medico() {
        return "medico";
    }

    @GetMapping("/medicoAntigo")
    public String medicoAntigo() {
        return "medicoAntigo";
    }

    // Redirecionamento antigo removido

    @GetMapping("/prontuario")
    public String prontuario() {
        return "prontuario";
    }

    @GetMapping("/novaConsulta")
    public String novaConsulta() {
        return "novaConsulta";
    }

}
