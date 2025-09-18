package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class DatabaseSeeder implements CommandLineRunner {
    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@example.com")) {
            Usuario admin = new Usuario();
            admin.setNome("Admin");
            admin.setEmail("admin@example.com");
            admin.setSenhaHash(encoder.encode("admin123"));
            admin.setRoles(Set.of("ROLE_ADMIN","ROLE_USER"));
            userRepository.save(admin);
        }
    }
}
