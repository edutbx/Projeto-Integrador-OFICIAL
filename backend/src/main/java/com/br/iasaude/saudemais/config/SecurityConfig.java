// Pacote de configuração de segurança da aplicação
package com.br.iasaude.saudemais.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.core.env.Environment;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.context.annotation.Primary;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

// Classe de configuração de segurança do Spring
@Configuration
@EnableMethodSecurity
public class SecurityConfig {
    /**
     * Retorna 401 JSON para requisições de API não autenticadas.
     * O frontend React trata esse status e redireciona para /login.
     * (Anteriormente fazia redirect para /login — isso quebra chamadas fetch() do React.)
     */
    @Bean
    @Primary
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return new AuthenticationEntryPoint() {
            @Override
            public void commence(HttpServletRequest request, HttpServletResponse response, org.springframework.security.core.AuthenticationException authException) throws IOException {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\": \"Nao autenticado\"}");
            }
        };
    }

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
        // Habilita o suporte a CORS no Spring Security (usa o CorsConfig registrado)
        http.cors(cors -> cors.configure(http));

        if (devProfile) {
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .csrf(csrf -> csrf.disable());
        } else {
            http.authorizeHttpRequests(auth -> auth
                            // Rotas públicas
                            .requestMatchers(
                                    "/",
                                    "/index.html",
                                    "/login",
                                    "/login-gestor",
                                    "/cadastro",
                                    "/entrar",
                                    "/servicos",
                                    "/contato",
                                    "/api/auth/login",
                                    "/api/auth/login-gestor",
                                    "/api/auth/register",
                                    "/api/notificacoes"
                            ).permitAll()

                            // Sessão autenticada para qualquer usuário logado
                            .requestMatchers("/api/auth/me").authenticated()

                            // Área médica
                            .requestMatchers(
                                    "/medico", "/medico.html",
                                    "/medico/pacientes",
                                    "/novaconsulta", "/novaconsulta.html",
                                    "/prontuario", "/prontuario.html"
                            ).hasRole("USER")

                            // Área gestor
                            .requestMatchers(
                                    "/gestor", "/gestor.html",
                                    "/gestor/medicos",
                                    "/gestor/pacientes",
                                    "/gestor/pacientes/prontuario"
                            ).hasRole("ADMIN")

                            // APIs administrativas
                            .requestMatchers("/api/auth/admin/**").hasRole("ADMIN")

                            // Qualquer outra requisição
                            .anyRequest().permitAll()
                    )
                    .csrf(csrf -> csrf.disable())
                    .exceptionHandling(e -> e.authenticationEntryPoint(customAuthenticationEntryPoint()));
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
