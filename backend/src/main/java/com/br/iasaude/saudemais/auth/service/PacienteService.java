package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.PacienteRequest;
import com.br.iasaude.saudemais.auth.dto.PacienteResponse;
import com.br.iasaude.saudemais.auth.model.Paciente;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    public PacienteService(PacienteRepository pacienteRepository) {
        this.pacienteRepository = pacienteRepository;
    }

    public PacienteResponse criar(PacienteRequest request, String actor) {
        String cpf = normalizarCpf(request.getCpf());
        validarCpfOuLancar(cpf);
        if (pacienteRepository.existsByCpf(cpf)) {
            throw new IllegalArgumentException("CPF já cadastrado");
        }
        Paciente paciente = new Paciente();
        paciente.setCpf(cpf);
        aplicarDadosDeCadastro(paciente, request);
        String agora = Instant.now().toString();
        paciente.setCriadoEm(agora);
        paciente.setAtualizadoEm(agora);
        paciente.setCriadoPor(actor);
        paciente.setAtualizadoPor(actor);
        return toResponse(pacienteRepository.save(paciente));
    }

    public List<PacienteResponse> listar(String busca) {
        String filtro = busca == null ? "" : busca.trim().toLowerCase(Locale.ROOT);
        return pacienteRepository.findAll().stream()
                .filter(p -> filtro.isBlank() || contemTermo(p, filtro))
                .sorted(Comparator.comparing(p -> valorSeguro(p.getNome())))
                .map(this::toResponse)
                .toList();
    }

    public PacienteResponse buscarPorId(String id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado"));
        return toResponse(paciente);
    }

    public PacienteResponse buscarPorCpf(String cpf) {
        String cpfNormalizado = normalizarCpf(cpf);
        Paciente paciente = pacienteRepository.findByCpf(cpfNormalizado)
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado"));
        return toResponse(paciente);
    }

    public PacienteResponse atualizar(String id, PacienteRequest request, String actor) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado"));
        String cpf = normalizarCpf(request.getCpf());
        validarCpfOuLancar(cpf);
        Optional<Paciente> existingByCpf = pacienteRepository.findByCpf(cpf);
        if (existingByCpf.isPresent() && !existingByCpf.get().getId().equals(id)) {
            throw new IllegalArgumentException("CPF já cadastrado para outro paciente");
        }
        paciente.setCpf(cpf);
        aplicarDadosDeCadastro(paciente, request);
        paciente.setAtualizadoEm(Instant.now().toString());
        paciente.setAtualizadoPor(actor);
        return toResponse(pacienteRepository.save(paciente));
    }

    public PacienteResponse atualizarVinculoMedico(String id, String medicoCrm, String actor) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado"));
        String crmNormalizado = normalizar(medicoCrm);
        paciente.setMedicoCrmReferencia(crmNormalizado);
        LinkedHashSet<String> medicosComAcesso = new LinkedHashSet<>(
                paciente.getMedicoCrmsComAcesso() == null ? Set.of() : paciente.getMedicoCrmsComAcesso()
        );
        if (!crmNormalizado.isBlank()) {
            medicosComAcesso.add(crmNormalizado);
        }
        paciente.setMedicoCrmsComAcesso(medicosComAcesso);
        paciente.setAtualizadoEm(Instant.now().toString());
        paciente.setAtualizadoPor(actor);
        return toResponse(pacienteRepository.save(paciente));
    }

    public void deletar(String id) {
        if (!pacienteRepository.existsById(id)) {
            throw new NoSuchElementException("Paciente não encontrado");
        }
        pacienteRepository.deleteById(id);
    }

    private void aplicarDadosDeCadastro(Paciente paciente, PacienteRequest request) {
        paciente.setNome(normalizar(request.getNome()));
        paciente.setIdade(request.getIdade());
        paciente.setEndereco(normalizar(request.getEndereco()));
        paciente.setAltura(request.getAltura());
        paciente.setPeso(request.getPeso());

        String crmReferencia = normalizar(request.getMedicoCrmReferencia());
        paciente.setMedicoCrmReferencia(crmReferencia);

        LinkedHashSet<String> medicosComAcesso = new LinkedHashSet<>();
        if (request.getMedicoCrmsComAcesso() != null) {
            for (String crm : request.getMedicoCrmsComAcesso()) {
                String crmNormalizado = normalizar(crm);
                if (!crmNormalizado.isBlank()) {
                    medicosComAcesso.add(crmNormalizado);
                }
            }
        }
        if (!crmReferencia.isBlank()) {
            medicosComAcesso.add(crmReferencia);
        }
        paciente.setMedicoCrmsComAcesso(medicosComAcesso);
    }

    private boolean contemTermo(Paciente paciente, String filtro) {
        return valorSeguro(paciente.getNome()).contains(filtro)
                || valorSeguro(paciente.getEndereco()).contains(filtro)
                || valorSeguro(paciente.getMedicoCrmReferencia()).contains(filtro)
                || valorSeguro(paciente.getCpf()).contains(filtro);
    }

    // Strips formatting and returns only digits. Input from frontend may be "123.456.789-00".
    private String normalizarCpf(String cpf) {
        return cpf == null ? "" : cpf.replaceAll("[^0-9]", "");
    }

    private void validarCpfOuLancar(String cpf) {
        if (!isCpfValido(cpf)) {
            throw new IllegalArgumentException("CPF inválido");
        }
    }

    private boolean isCpfValido(String digits) {
        if (digits == null || digits.length() != 11) return false;
        if (digits.chars().distinct().count() == 1) return false;
        int sum = 0;
        for (int i = 0; i < 9; i++) sum += Character.getNumericValue(digits.charAt(i)) * (10 - i);
        int r = sum % 11;
        int d1 = r < 2 ? 0 : 11 - r;
        if (d1 != Character.getNumericValue(digits.charAt(9))) return false;
        sum = 0;
        for (int i = 0; i < 10; i++) sum += Character.getNumericValue(digits.charAt(i)) * (11 - i);
        r = sum % 11;
        int d2 = r < 2 ? 0 : 11 - r;
        return d2 == Character.getNumericValue(digits.charAt(10));
    }

    private String valorSeguro(String valor) {
        return valor == null ? "" : valor.toLowerCase(Locale.ROOT);
    }

    private String normalizar(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private PacienteResponse toResponse(Paciente paciente) {
        return new PacienteResponse(
                paciente.getId(),
                paciente.getCpf(),
                paciente.getNome(),
                paciente.getIdade(),
                paciente.getEndereco(),
                paciente.getAltura(),
                paciente.getPeso(),
                paciente.getMedicoCrmReferencia(),
                paciente.getMedicoCrmsComAcesso() == null ? Set.of() : paciente.getMedicoCrmsComAcesso(),
                paciente.getProntuarioAtualId(),
                paciente.getUltimaAlteracaoProntuarioPorCrm(),
                paciente.getUltimaAlteracaoProntuarioEm()
        );
    }
}
