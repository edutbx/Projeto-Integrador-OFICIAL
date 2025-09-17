<<<<<<< HEAD
package com.br.iasaude.saudemais.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz
                .requestMatchers("/", "/index", "/index.html", "/CSS/**", "/img/**", "/styleHome/**", "/styleLogin/**", "/styleMedico/**", "/styleGestor/**", "/static/**", "/**.css", "/**.js", "/**.png", "/**.jpg", "/**.jpeg", "/**.ico", "/login.html", "/api/**").permitAll()
                .anyRequest().permitAll()
            )
            .csrf(csrf -> csrf.disable());
        return http.build();
    }
}
=======
package com.br.iasaude.saudemais.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests((authz) -> authz
                .requestMatchers("/", "/index", "/index.html", "/CSS/**", "/img/**", "/styleHome/**", "/styleLogin/**", "/styleMedico/**", "/styleGestor/**", "/static/**", "/**.css", "/**.js", "/**.png", "/**.jpg", "/**.jpeg", "/**.ico", "/login.html").permitAll()
                .anyRequest().permitAll()
            );
        return http.build();
    }
}
>>>>>>> 21d6db1733199bba27884aab4d8dc4ad4fed399f
