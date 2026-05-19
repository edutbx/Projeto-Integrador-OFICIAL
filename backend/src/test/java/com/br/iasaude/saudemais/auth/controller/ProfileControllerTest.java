package com.br.iasaude.saudemais.auth.controller;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class ProfileControllerTest {

    @Test
    void getProfile_deveRetornarPerfisEFlagDev() {
        Environment env = mock(Environment.class);
        when(env.getActiveProfiles()).thenReturn(new String[]{"dev", "local"});

        ProfileController controller = new ProfileController(env);
        Map<String, Object> response = controller.getProfile();

        assertEquals(2, ((String[]) response.get("activeProfiles")).length);
        assertTrue((Boolean) response.get("dev"));
    }
}
