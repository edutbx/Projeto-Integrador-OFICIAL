package com.br.iasaude.saudemais;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class SaudeApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(SaudeApplication.class);
        Environment env = app.run(args).getEnvironment();
        String port = env.getProperty("server.port", "8080");
        System.out.println("\n========================================");
        System.out.println("  Servidor iniciado com sucesso!");
        System.out.println("  Acesse: http://localhost:" + port);
        System.out.println("========================================\n");
    }

    @EventListener(ContextRefreshedEvent.class)
    public void onContextRefreshed(ContextRefreshedEvent event) {
        // Só exibe a mensagem se for reinicialização (parent != null)
        if (event.getApplicationContext().getParent() != null) {
            System.out.println("\n========================================");
            System.out.println("  Servidor reiniciado!");
            System.out.println("========================================\n");
        }
    }


}
