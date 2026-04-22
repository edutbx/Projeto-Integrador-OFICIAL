package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.ProntuarioRequest;
import com.br.iasaude.saudemais.auth.model.Paciente;
import com.br.iasaude.saudemais.auth.model.Prontuario;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import com.br.iasaude.saudemais.auth.repository.ProntuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.NoSuchElementException;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProntuarioServiceTest {

    @Mock
    private ProntuarioRepository prontuarioRepository;

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private ProntuarioService prontuarioService;

    private ProntuarioRequest request;
    private Paciente paciente;

    @BeforeEach
    void setup() {
        request = new ProntuarioRequest();
        request.setResumoProblema("  Dor de cabeça  ");
        request.setHistoricoDoencaAtual("2 dias");
        request.setSintomasRelatados("Nausea");

        paciente = new Paciente();
        paciente.setId("p1");
        paciente.setNome("Joao");
        paciente.setIdade(32);
        paciente.setEndereco("Rua 1");
        paciente.setAltura(1.75);
        paciente.setPeso(80.0);
        paciente.setMedicoCrmReferencia("CRM1");
    }

    @Test
    void criarParaPaciente_deveCriarProntuarioEAtualizarPaciente() {
        when(pacienteRepository.findById("p1")).thenReturn(Optional.of(paciente));
        when(prontuarioRepository.findByPacienteId("p1")).thenReturn(Optional.empty());
        when(prontuarioRepository.save(any(Prontuario.class))).thenAnswer(inv -> {
            Prontuario p = inv.getArgument(0);
            p.setId("pr1");
            return p;
        });
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = prontuarioService.criarParaPaciente("p1", request, "CRM1");

        assertEquals("pr1", response.getId());
        assertEquals("p1", response.getPacienteId());
        assertEquals("Dor de cabeça", response.getResumoProblema());
        assertEquals("pr1", paciente.getProntuarioAtualId());
        verify(pacienteRepository).save(paciente);
    }

    @Test
    void criarParaPaciente_quandoPacienteJaTemProntuario_deveLancarErro() {
        when(pacienteRepository.findById("p1")).thenReturn(Optional.of(paciente));
        when(prontuarioRepository.findByPacienteId("p1")).thenReturn(Optional.of(new Prontuario()));

        assertThrows(IllegalStateException.class,
                () -> prontuarioService.criarParaPaciente("p1", request, "CRM1"));
    }

    @Test
    void buscarPorPacienteId_quandoNaoExiste_deveLancar() {
        when(prontuarioRepository.findByPacienteId("p1")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> prontuarioService.buscarPorPacienteId("p1"));
    }

    @Test
    void atualizar_deveAtualizarSnapshotEConteudo() {
        Prontuario existente = new Prontuario();
        existente.setId("pr1");
        existente.setPacienteId("p1");
        when(prontuarioRepository.findById("pr1")).thenReturn(Optional.of(existente));
        when(pacienteRepository.findById("p1")).thenReturn(Optional.of(paciente));
        when(prontuarioRepository.save(any(Prontuario.class))).thenAnswer(inv -> inv.getArgument(0));
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = prontuarioService.atualizar("pr1", request, "CRM2");

        assertEquals("Joao", response.getPacienteNome());
        assertEquals("Dor de cabeça", response.getResumoProblema());
        assertEquals("CRM2", response.getAtualizadoPor());
        assertNotNull(response.getAtualizadoEm());
    }

    @Test
    void interpretarComIa_quandoNaoExisteProntuario_deveLancar() {
        when(prontuarioRepository.findById("x")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> prontuarioService.interpretarComIa("x", "CRM1"));
    }

    @Test
    void interpretarComIa_quandoFalhaConsultaIa_deveLancarIllegalState() {
        Prontuario existente = new Prontuario();
        existente.setId("pr1");
        existente.setPacienteId("p1");
        when(prontuarioRepository.findById("pr1")).thenReturn(Optional.of(existente));

        assertThrows(IllegalStateException.class, () -> prontuarioService.interpretarComIa("pr1", "CRM1"));
    }

    @Test
    void deletar_quandoExiste_deveRemover() {
        Prontuario existente = new Prontuario();
        existente.setId("pr1");
        when(prontuarioRepository.findById("pr1")).thenReturn(Optional.of(existente));

        prontuarioService.deletar("pr1");

        verify(prontuarioRepository).deleteById("pr1");
    }
}
