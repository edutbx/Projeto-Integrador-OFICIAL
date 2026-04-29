package com.br.iasaude.saudemais.auth.service;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

class JwtServiceTest {

    @Test
    void generateAndParseToken_deveManterSubjectEClaims() {
        String secret = "12345678901234567890123456789012";
        JwtService jwtService = new JwtService(secret, 60_000);

        String token = jwtService.generateToken("CRM123", Map.of("name", "Ana"));
        Claims claims = jwtService.parseToken(token);

        assertEquals("CRM123", claims.getSubject());
        assertEquals("Ana", claims.get("name", String.class));
    }
}
