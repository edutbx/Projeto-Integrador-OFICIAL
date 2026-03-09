// Controller responsável pelas rotas principais da aplicação web
package com.br.iasaude.saudemais.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping
public class appController {
    // Rota para a página inicial
    @GetMapping("/")
    public String home() {
        return "index";
    }

    // Rota para a página de login
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // Rota para a página do gestor
    @GetMapping("/gestor")
    public String gestor() {
        return "gestor";
    }

    // Rota para a página do médico
    @GetMapping("/medico")
    public String medico() {
        return "medico";
    }

    // Rota para a página do médico antigo
    @GetMapping("/medicoAntigo")
    public String medicoAntigo() {
        return "medicoAntigo";
    }

    // Rota para a página de prontuário
    @GetMapping("/prontuario")
    public String prontuario() {
        return "prontuario";
    }

    // Rota para a página de nova consulta (antigo medico sem hora marcada)
    @GetMapping("/novaConsulta")
    public String novaConsulta() {
        return "novaConsulta";
    }

    // Rota para a página de registro
    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    // Rota para a página "Sobre Nós"
    @GetMapping("/sobreNos")
    public String sobreNos() {
        return "sobreNos";
    }

}
