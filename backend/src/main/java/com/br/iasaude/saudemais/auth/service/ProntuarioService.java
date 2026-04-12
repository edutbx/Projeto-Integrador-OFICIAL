package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.ProntuarioRequest;
import com.br.iasaude.saudemais.auth.dto.ProntuarioResponse;
import com.br.iasaude.saudemais.auth.model.Paciente;
import com.br.iasaude.saudemais.auth.model.Prontuario;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import com.br.iasaude.saudemais.auth.repository.ProntuarioRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
public class ProntuarioService {

    private final ProntuarioRepository prontuarioRepository;
    private final PacienteRepository pacienteRepository;

    public ProntuarioService(ProntuarioRepository prontuarioRepository, PacienteRepository pacienteRepository) {
        this.prontuarioRepository = prontuarioRepository;
        this.pacienteRepository = pacienteRepository;
    }

    public ProntuarioResponse criarParaPaciente(String pacienteId, ProntuarioRequest request, String actor) {
        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado"));

        if (prontuarioRepository.findByPacienteId(pacienteId).isPresent()) {
            throw new IllegalStateException("Paciente já possui prontuário cadastrado");
        }

        Prontuario prontuario = new Prontuario();
        prontuario.setPacienteId(pacienteId);
        preencherSnapshotPaciente(prontuario, paciente);
        aplicarConteudoClinico(prontuario, request);

        String agora = Instant.now().toString();
        prontuario.setCriadoEm(agora);
        prontuario.setAtualizadoEm(agora);
        prontuario.setCriadoPor(actor);
        prontuario.setAtualizadoPor(actor);

        Prontuario salvo = prontuarioRepository.save(prontuario);
        atualizarReferenciaProntuarioNoPaciente(paciente, salvo, actor, agora);
        return toResponse(salvo);
    }

    public ProntuarioResponse buscarPorPacienteId(String pacienteId) {
        Prontuario prontuario = prontuarioRepository.findByPacienteId(pacienteId)
                .orElseThrow(() -> new NoSuchElementException("Prontuário não encontrado para o paciente"));
        return toResponse(prontuario);
    }

    public ProntuarioResponse buscarPorId(String id) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Prontuário não encontrado"));
        return toResponse(prontuario);
    }

    public ProntuarioResponse atualizar(String id, ProntuarioRequest request, String actor) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Prontuário não encontrado"));

        Paciente paciente = pacienteRepository.findById(prontuario.getPacienteId())
                .orElseThrow(() -> new NoSuchElementException("Paciente não encontrado"));

        preencherSnapshotPaciente(prontuario, paciente);
        aplicarConteudoClinico(prontuario, request);
        prontuario.setAtualizadoEm(Instant.now().toString());
        prontuario.setAtualizadoPor(actor);

        Prontuario salvo = prontuarioRepository.save(prontuario);
        atualizarReferenciaProntuarioNoPaciente(paciente, salvo, actor, salvo.getAtualizadoEm());
        return toResponse(salvo);
    }

    public String interpretarComIa(String id, String actor) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Prontuário não encontrado"));

        try {
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("nome", valor(prontuario.getPacienteNome()));
            payload.put("idade", prontuario.getPacienteIdade() == null ? "" : prontuario.getPacienteIdade());
            payload.put("endereco", valor(prontuario.getPacienteEndereco()));
            payload.put("altura", prontuario.getPacienteAltura() == null ? "" : prontuario.getPacienteAltura());
            payload.put("peso", prontuario.getPacientePeso() == null ? "" : prontuario.getPacientePeso());
            payload.put("resumoProblema", valor(prontuario.getResumoProblema()));
            payload.put("historicoDoencaAtual", valor(prontuario.getHistoricoDoencaAtual()));
            payload.put("sintomasRelatados", valor(prontuario.getSintomasRelatados()));
            payload.put("alergias", valor(prontuario.getAlergias()));
            payload.put("medicamentosEmUso", valor(prontuario.getMedicamentosEmUso()));
            payload.put("hipoteseDiagnostica", valor(prontuario.getHipoteseDiagnostica()));
            payload.put("condutaMedica", valor(prontuario.getCondutaMedica()));
            payload.put("examesSolicitados", valor(prontuario.getExamesSolicitados()));
            payload.put("observacoesGerais", valor(prontuario.getObservacoesGerais()));

            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> requestBody = Map.of("user_prompt", payload);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(mapper.writeValueAsString(requestBody), headers);

            RestTemplate restTemplate = new RestTemplate();
            String iaResponse = restTemplate.exchange(
                    "http://localhost:8000/chat",
                    HttpMethod.POST,
                    entity,
                    String.class
            ).getBody();

            prontuario.setInterpretacaoIa(iaResponse == null ? "" : iaResponse);
            prontuario.setAtualizadoPor(actor);
            prontuario.setAtualizadoEm(Instant.now().toString());
            prontuarioRepository.save(prontuario);

            return prontuario.getInterpretacaoIa();
        } catch (Exception e) {
            throw new IllegalStateException("Erro ao consultar IA: " + e.getMessage(), e);
        }
    }

    public void deletar(String id) {
        Prontuario prontuario = prontuarioRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Prontuário não encontrado"));

        prontuarioRepository.deleteById(id);
    }

    private void preencherSnapshotPaciente(Prontuario prontuario, Paciente paciente) {
        prontuario.setPacienteNome(valor(paciente.getNome()));
        prontuario.setPacienteIdade(paciente.getIdade());
        prontuario.setPacienteEndereco(valor(paciente.getEndereco()));
        prontuario.setPacienteAltura(paciente.getAltura());
        prontuario.setPacientePeso(paciente.getPeso());
        prontuario.setMedicoCrmReferencia(valor(paciente.getMedicoCrmReferencia()));
    }

    private void aplicarConteudoClinico(Prontuario prontuario, ProntuarioRequest request) {
        prontuario.setResumoProblema(valor(request.getResumoProblema()));
        prontuario.setHistoricoDoencaAtual(valor(request.getHistoricoDoencaAtual()));
        prontuario.setSintomasRelatados(valor(request.getSintomasRelatados()));
        prontuario.setAlergias(valor(request.getAlergias()));
        prontuario.setMedicamentosEmUso(valor(request.getMedicamentosEmUso()));
        prontuario.setHipoteseDiagnostica(valor(request.getHipoteseDiagnostica()));
        prontuario.setCondutaMedica(valor(request.getCondutaMedica()));
        prontuario.setExamesSolicitados(valor(request.getExamesSolicitados()));
        prontuario.setObservacoesGerais(valor(request.getObservacoesGerais()));
    }

    private void atualizarReferenciaProntuarioNoPaciente(Paciente paciente, Prontuario prontuario, String actor, String atualizadoEm) {
        paciente.setProntuarioAtualId(prontuario.getId());
        paciente.setUltimaAlteracaoProntuarioPorCrm(actor);
        paciente.setUltimaAlteracaoProntuarioEm(atualizadoEm);
        paciente.setAtualizadoPor(actor);
        paciente.setAtualizadoEm(atualizadoEm);
        pacienteRepository.save(paciente);
    }

    private ProntuarioResponse toResponse(Prontuario prontuario) {
        return new ProntuarioResponse(
                prontuario.getId(),
                prontuario.getPacienteId(),
                prontuario.getPacienteNome(),
                prontuario.getPacienteIdade(),
                prontuario.getPacienteEndereco(),
                prontuario.getPacienteAltura(),
                prontuario.getPacientePeso(),
                prontuario.getMedicoCrmReferencia(),
                prontuario.getResumoProblema(),
                prontuario.getHistoricoDoencaAtual(),
                prontuario.getSintomasRelatados(),
                prontuario.getAlergias(),
                prontuario.getMedicamentosEmUso(),
                prontuario.getHipoteseDiagnostica(),
                prontuario.getCondutaMedica(),
                prontuario.getExamesSolicitados(),
                prontuario.getObservacoesGerais(),
                prontuario.getInterpretacaoIa(),
                prontuario.getAtualizadoPor(),
                prontuario.getAtualizadoEm()
        );
    }

    private String valor(String value) {
        return value == null ? "" : value.trim();
    }
}