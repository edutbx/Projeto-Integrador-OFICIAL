package com.br.iasaude.saudemais.config;

import com.br.iasaude.saudemais.auth.service.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import java.util.logging.Logger;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = Logger.getLogger(JwtAuthenticationFilter.class.getName());
    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        logger.info("JwtAuthenticationFilter executado para: " + request.getRequestURI());
        String token = null;
        String authHeader = request.getHeader("Authorization");
        logger.info("Authorization header: " + authHeader);
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else if (request.getCookies() != null) {
            for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    token = cookie.getValue();
                    logger.info("Token JWT encontrado no cookie.");
                    break;
                }
            }
        }
        if (token != null) {
            logger.info("Token recebido: " + token);
            try {
                Claims claims = jwtService.parseToken(token);
                String username = claims.getSubject();
                logger.info("Usuário extraído do token: " + username);
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    List<String> roles = claims.get("roles", List.class);
                    logger.info("Roles extraídas do token: " + roles);
                    List<SimpleGrantedAuthority> authorities = roles != null
                        ? roles.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
                        : List.of();
                    UserDetails userDetails = User.withUsername(username)
                            .password("")
                            .authorities(authorities)
                            .build();
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("Usuário autenticado no contexto do Spring Security.");
                }
            } catch (Exception e) {
                logger.warning("Falha ao validar token JWT: " + e.getMessage());
            }
        } else {
            logger.info("Authorization header e cookie JWT ausentes ou mal formatados.");
        }
        filterChain.doFilter(request, response);
    }
}
