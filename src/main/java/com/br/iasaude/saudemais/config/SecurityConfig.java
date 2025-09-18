// Pacote de configuração de segurança da aplicação
package com.br.iasaude.saudemais.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Classe de configuração de segurança do Spring
@Configuration
public class SecurityConfig {

    private final Environment env;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    public SecurityConfig(Environment env, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.env = env;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Se o perfil 'dev' estiver ativo, libera tudo
        boolean devProfile = false;
        for (String profile : env.getActiveProfiles()) {
            if (profile.equals("dev")) {
                devProfile = true;
                break;
            }
        }
        if (devProfile) {
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(csrf -> csrf.disable());
        } else {
            http.authorizeHttpRequests(auth -> auth
                    .requestMatchers(
                        "/medico.html", "/medico",
                        "/novaconsulta.html", "/prontuario.html", "/gestor.html",
                        "/novaconsulta", "/prontuario", "/gestor"
                    ).permitAll()
                    .requestMatchers("/api/medico").authenticated()
                    .anyRequest().permitAll()
                )
                .csrf(csrf -> csrf.disable());
        }
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public org.springframework.security.crypto.password.PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    @Bean
    public org.springframework.security.authentication.AuthenticationManager authenticationManager(
            org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
