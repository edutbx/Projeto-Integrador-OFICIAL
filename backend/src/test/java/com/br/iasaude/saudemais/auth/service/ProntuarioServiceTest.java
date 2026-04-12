package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.ProntuarioRequest;
import com.br.iasaude.saudemais.auth.dto.ProntuarioResponse;
import com.br.iasaude.saudemais.auth.model.Paciente;
import com.br.iasaude.saudemais.auth.model.Prontuario;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import com.br.iasaude.saudemais.auth.repository.ProntuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProntuarioServiceTest {

    @Mock
    private ProntuarioRepository prontuarioRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    private ProntuarioService prontuarioService;

    @BeforeEach
    void setUp() {
        prontuarioService = new ProntuarioService(prontuarioRepository, pacienteRepository);
    }

    @Test
    void criarParaPacienteDeveCriarProntuarioEAtualizarPaciente() {
        Paciente paciente = novoPaciente();
        ProntuarioRequest request = novoRequest();

        when(pacienteRepository.findById("pac-1")).thenReturn(Optional.of(paciente));
        when(prontuarioRepository.findByPacienteId("pac-1")).thenReturn(Optional.empty());
        when(prontuarioRepository.save(any(Prontuario.class))).thenAnswer(invocation -> {
            Prontuario p = invocation.getArgument(0);
            p.setId("pro-1");
            return p;
        });
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProntuarioResponse response = prontuarioService.criarParaPaciente("pac-1", request, "gestor@saude.com");

        assertEquals("pro-1", response.getId());
        assertEquals("pac-1", response.getPacienteId());
        assertEquals("Carolina", response.getPacienteNome());
        assertEquals("Dor abdominal", response.getResumoProblema());

        ArgumentCaptor<Paciente> pacienteCaptor = ArgumentCaptor.forClass(Paciente.class);
        verify(pacienteRepository).save(pacienteCaptor.capture());
        Paciente atualizado = pacienteCaptor.getValue();
        assertEquals("pro-1", atualizado.getProntuarioAtualId());
        assertEquals("gestor@saude.com", atualizado.getUltimaAlteracaoProntuarioPorCrm());
        assertNotNull(atualizado.getUltimaAlteracaoProntuarioEm());
    }

    @Test
    void criarParaPacienteQuandoPacienteNaoExisteDeveLancarExcecao() {
        when(pacienteRepository.findById("pac-x")).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> prontuarioService.criarParaPaciente("pac-x", novoRequest(), "gestor@saude.com")
        );

        assertEquals("Paciente não encontrado", ex.getMessage());
        verify(prontuarioRepository, never()).save(any(Prontuario.class));
    }

    @Test
    void criarParaPacienteQuandoJaExisteDeveLancarExcecao() {
        when(pacienteRepository.findById("pac-1")).thenReturn(Optional.of(novoPaciente()));
        when(prontuarioRepository.findByPacienteId("pac-1")).thenReturn(Optional.of(novoProntuario()));

        IllegalStateException ex = assertThrows(
                IllegalStateException.class,
                () -> prontuarioService.criarParaPaciente("pac-1", novoRequest(), "gestor@saude.com")
        );

        assertEquals("Paciente já possui prontuário cadastrado", ex.getMessage());
    }

    @Test
    void buscarPorPacienteIdDeveRetornarProntuario() {
        Prontuario prontuario = novoProntuario();
        when(prontuarioRepository.findByPacienteId("pac-1")).thenReturn(Optional.of(prontuario));

        ProntuarioResponse response = prontuarioService.buscarPorPacienteId("pac-1");

        assertEquals("pro-1", response.getId());
        assertEquals("pac-1", response.getPacienteId());
    }

    @Test
    void atualizarDeveAtualizarConteudoEReferencias() {
        Prontuario prontuario = novoProntuario();
        Paciente paciente = novoPaciente();
        ProntuarioRequest request = novoRequest();
        request.setResumoProblema("Resumo atualizado");

        when(prontuarioRepository.findById("pro-1")).thenReturn(Optional.of(prontuario));
        when(pacienteRepository.findById("pac-1")).thenReturn(Optional.of(paciente));
        when(prontuarioRepository.save(any(Prontuario.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ProntuarioResponse response = prontuarioService.atualizar("pro-1", request, "crm-medico-01");

        assertEquals("Resumo atualizado", response.getResumoProblema());
        assertEquals("crm-medico-01", response.getAtualizadoPor());
        assertNotNull(response.getAtualizadoEm());

        ArgumentCaptor<Paciente> pacienteCaptor = ArgumentCaptor.forClass(Paciente.class);
        verify(pacienteRepository, times(1)).save(pacienteCaptor.capture());
        assertEquals("pro-1", pacienteCaptor.getValue().getProntuarioAtualId());
    }

    @Test
    void atualizarQuandoProntuarioNaoExisteDeveLancarExcecao() {
        when(prontuarioRepository.findById("pro-x")).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> prontuarioService.atualizar("pro-x", novoRequest(), "crm-medico-01")
        );

        assertEquals("Prontuário não encontrado", ex.getMessage());
    }

    @Test
    void interpretarComIaQuandoProntuarioNaoExisteDeveLancarExcecao() {
        when(prontuarioRepository.findById("pro-x")).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> prontuarioService.interpretarComIa("pro-x", "crm-medico-01")
        );

        assertEquals("Prontuário não encontrado", ex.getMessage());
    }

    @Test
    void deletarQuandoExisteDeveRemover() {
        when(prontuarioRepository.findById("pro-1")).thenReturn(Optional.of(novoProntuario()));

        prontuarioService.deletar("pro-1");

        verify(prontuarioRepository).deleteById("pro-1");
    }

    @Test
    void deletarQuandoNaoExisteDeveLancarExcecao() {
        when(prontuarioRepository.findById(anyString())).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> prontuarioService.deletar("pro-x")
        );

        assertEquals("Prontuário não encontrado", ex.getMessage());
        verify(prontuarioRepository, never()).deleteById(anyString());
    }

    private Paciente novoPaciente() {
        Paciente paciente = new Paciente();
        paciente.setId("pac-1");
        paciente.setNome("Carolina");
        paciente.setIdade(25);
        paciente.setEndereco("Rua das Flores");
        paciente.setAltura(1.63);
        paciente.setPeso(56.0);
        paciente.setMedicoCrmReferencia("CRM-123");
        return paciente;
    }

    private ProntuarioRequest novoRequest() {
        ProntuarioRequest request = new ProntuarioRequest();
        request.setResumoProblema("Dor abdominal");
        request.setHistoricoDoencaAtual("Início há 2 dias");
        request.setSintomasRelatados("Náusea e dor");
        request.setAlergias("Nenhuma");
        request.setMedicamentosEmUso("Dipirona");
        request.setHipoteseDiagnostica("Gastrite");
        request.setCondutaMedica("Hidratação e observação");
        request.setExamesSolicitados("Hemograma");
        request.setObservacoesGerais("Sem febre");
        return request;
    }

    private Prontuario novoProntuario() {
        Prontuario prontuario = new Prontuario();
        prontuario.setId("pro-1");
        prontuario.setPacienteId("pac-1");
        prontuario.setPacienteNome("Carolina");
        prontuario.setPacienteIdade(25);
        prontuario.setPacienteEndereco("Rua das Flores");
        prontuario.setPacienteAltura(1.63);
        prontuario.setPacientePeso(56.0);
        prontuario.setMedicoCrmReferencia("CRM-123");
        prontuario.setResumoProblema("Resumo inicial");
        return prontuario;
    }
}
