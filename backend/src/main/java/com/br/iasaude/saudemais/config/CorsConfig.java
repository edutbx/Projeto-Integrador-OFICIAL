package com.br.iasaude.saudemais.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Configuração de CORS para permitir que o frontend React (porta 3000)
 * se comunique com o backend Spring Boot (porta 5000) durante o desenvolvimento.
 *
 * Em produção, o React é buildado (npm run build) e servido pelo próprio Spring Boot,
 * então o CORS não é necessário — ambos estarão na mesma origem (:5000).
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // Permite o dev server do React na porta 3000
        config.setAllowedOrigins(List.of("http://localhost:3000"));

        // Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        // Headers permitidos nas requisições
        config.setAllowedHeaders(List.of("*"));

        // Permite envio de cookies (necessário para o JWT em cookie)
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica apenas nas rotas de API — as rotas de página ficam para o Thymeleaf
        source.registerCorsConfiguration("/api/**", config);

        return new CorsFilter(source);
    }
}
