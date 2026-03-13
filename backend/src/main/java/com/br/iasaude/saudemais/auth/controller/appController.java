// Controller responsável pelas rotas principais da aplicação web
package com.br.iasaude.saudemais.auth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class appController {

    @GetMapping("/")
    public String home() {
        return "forward:/";
    }

    @GetMapping("/login")
    public String login() {
        return "forward:/";
    }

    @GetMapping("/gestor")
    public String gestor() {
        return "forward:/";
    }

    @GetMapping("/medico")
    public String medico() {
        return "forward:/";
    }

    @GetMapping("/prontuario")
    public String prontuario() {
        return "forward:/";
    }

    @GetMapping("/novaConsulta")
    public String novaConsulta() {
        return "forward:/";
    }

    @GetMapping("/sobreNos")
    public String sobreNos() {
        return "forward:/";
    }

    @GetMapping("/servicos")
    public String servicos() {
        return "forward:/";
    }

    @GetMapping("/contato")
    public String contato() {
        return "forward:/";
    }

    @GetMapping("/entrar")
    public String entrar() {
        return "forward:/";
    }

    @GetMapping("/login-gestor")
    public String loginGestor() {
        return "forward:/";
    }

    @GetMapping("/gestor/medicos")
    public String gestorMedicos() {
        return "forward:/";
    }
}
