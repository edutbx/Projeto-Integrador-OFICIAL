package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.model.Usuario;
import com.br.iasaude.saudemais.auth.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String crm) throws UsernameNotFoundException {
        Usuario user = userRepository.findByCrm(crm)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com CRM: " + crm));
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getCrm())
                .password(user.getSenha())
                .authorities(user.getRoles().toArray(new String[0]))
                .build();
    }
}
