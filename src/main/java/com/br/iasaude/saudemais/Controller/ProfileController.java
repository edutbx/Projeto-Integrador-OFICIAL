package com.br.iasaude.saudemais.Controller;

import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Arrays;
import java.util.Map;

@RestController
public class ProfileController {
    private final Environment env;

    public ProfileController(Environment env) {
        this.env = env;
    }

    @GetMapping("/api/profile")
    public Map<String, Object> getProfile() {
        String[] profiles = env.getActiveProfiles();
        return Map.of(
            "activeProfiles", profiles,
            "dev", Arrays.asList(profiles).contains("dev")
        );
    }
}