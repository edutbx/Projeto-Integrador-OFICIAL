package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.PacienteRequest;
import com.br.iasaude.saudemais.auth.dto.PacienteResponse;
import com.br.iasaude.saudemais.auth.model.Paciente;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PacienteServiceTest {

    @Mock
    private PacienteRepository pacienteRepository;

    private PacienteService pacienteService;

    @BeforeEach
    void setUp() {
        pacienteService = new PacienteService(pacienteRepository);
    }

    @Test
    void criarDeveSalvarPacienteComCamposNormalizadosEActor() {
        PacienteRequest request = novoRequest();
        request.setNome("  Ana Clara  ");
        request.setEndereco("  Rua A, 123  ");
        request.setMedicoCrmReferencia("  CRM-001  ");
        request.setMedicoCrmsComAcesso(Set.of("CRM-001", "  CRM-002  "));

        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(invocation -> {
            Paciente p = invocation.getArgument(0);
            p.setId("pac-1");
            return p;
        });

        PacienteResponse response = pacienteService.criar(request, "gestor@saude.com");

        ArgumentCaptor<Paciente> captor = ArgumentCaptor.forClass(Paciente.class);
        verify(pacienteRepository).save(captor.capture());
        Paciente salvo = captor.getValue();

        assertEquals("Ana Clara", salvo.getNome());
        assertEquals("Rua A, 123", salvo.getEndereco());
        assertEquals("CRM-001", salvo.getMedicoCrmReferencia());
        assertTrue(salvo.getMedicoCrmsComAcesso().contains("CRM-001"));
        assertTrue(salvo.getMedicoCrmsComAcesso().contains("CRM-002"));
        assertEquals("gestor@saude.com", salvo.getCriadoPor());
        assertEquals("gestor@saude.com", salvo.getAtualizadoPor());
        assertNotNull(salvo.getCriadoEm());
        assertNotNull(salvo.getAtualizadoEm());

        assertEquals("pac-1", response.getId());
        assertEquals("Ana Clara", response.getNome());
        assertEquals(31, response.getIdade());
        assertEquals("Rua A, 123", response.getEndereco());
    }

    @Test
    void listarDeveFiltrarPorBuscaESortearPorNome() {
        Paciente p1 = novoPaciente("1", "Bruno", "Rua Azul", "CRM-100");
        Paciente p2 = novoPaciente("2", "Alice", "Rua Verde", "CRM-200");
        Paciente p3 = novoPaciente("3", "Caio", "Rua Roxa", "CRM-300");

        when(pacienteRepository.findAll()).thenReturn(List.of(p1, p2, p3));

        List<PacienteResponse> filtrados = pacienteService.listar("rua");
        assertEquals(3, filtrados.size());
        assertEquals("Alice", filtrados.get(0).getNome());
        assertEquals("Bruno", filtrados.get(1).getNome());
        assertEquals("Caio", filtrados.get(2).getNome());

        List<PacienteResponse> buscaCrm = pacienteService.listar("crm-200");
        assertEquals(1, buscaCrm.size());
        assertEquals("Alice", buscaCrm.get(0).getNome());

        List<PacienteResponse> semResultado = pacienteService.listar("nao-existe");
        assertTrue(semResultado.isEmpty());
    }

    @Test
    void buscarPorIdQuandoExisteDeveRetornarPaciente() {
        Paciente paciente = novoPaciente("pac-1", "Maria", "Av. Central", "CRM-777");
        when(pacienteRepository.findById("pac-1")).thenReturn(Optional.of(paciente));

        PacienteResponse response = pacienteService.buscarPorId("pac-1");

        assertEquals("pac-1", response.getId());
        assertEquals("Maria", response.getNome());
        assertEquals("CRM-777", response.getMedicoCrmReferencia());
    }

    @Test
    void buscarPorIdQuandoNaoExisteDeveLancarExcecao() {
        when(pacienteRepository.findById("pac-404")).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> pacienteService.buscarPorId("pac-404")
        );

        assertEquals("Paciente não encontrado", ex.getMessage());
    }

    @Test
    void atualizarQuandoExisteDevePersistirNovosDados() {
        Paciente existente = novoPaciente("pac-2", "Joao", "Rua Antiga", "CRM-001");
        existente.setAtualizadoEm("2026-01-01T00:00:00Z");

        PacienteRequest request = novoRequest();
        request.setNome("  Joao Pedro ");
        request.setEndereco(" Rua Nova ");
        request.setMedicoCrmReferencia(" CRM-900 ");

        when(pacienteRepository.findById("pac-2")).thenReturn(Optional.of(existente));
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PacienteResponse response = pacienteService.atualizar("pac-2", request, "admin@saude.com");

        assertEquals("Joao Pedro", response.getNome());
        assertEquals("Rua Nova", response.getEndereco());
        assertEquals("CRM-900", response.getMedicoCrmReferencia());

        ArgumentCaptor<Paciente> captor = ArgumentCaptor.forClass(Paciente.class);
        verify(pacienteRepository).save(captor.capture());
        Paciente salvo = captor.getValue();
        assertEquals("admin@saude.com", salvo.getAtualizadoPor());
        assertNotNull(salvo.getAtualizadoEm());
        assertTrue(salvo.getMedicoCrmsComAcesso().contains("CRM-900"));
    }

    @Test
    void atualizarQuandoNaoExisteDeveLancarExcecao() {
        when(pacienteRepository.findById("pac-x")).thenReturn(Optional.empty());

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> pacienteService.atualizar("pac-x", novoRequest(), "admin@saude.com")
        );

        assertEquals("Paciente não encontrado", ex.getMessage());
        verify(pacienteRepository, never()).save(any(Paciente.class));
    }

    @Test
    void atualizarVinculoMedicoDeveAtualizarReferenciaESetDeAcesso() {
        Paciente existente = novoPaciente("pac-3", "Livia", "Rua B", "CRM-010");
        existente.setMedicoCrmsComAcesso(new LinkedHashSet<>(Set.of("CRM-010")));

        when(pacienteRepository.findById("pac-3")).thenReturn(Optional.of(existente));
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(invocation -> invocation.getArgument(0));

        PacienteResponse response = pacienteService.atualizarVinculoMedico("pac-3", " CRM-020 ", "admin@saude.com");

        assertEquals("CRM-020", response.getMedicoCrmReferencia());
        assertTrue(response.getMedicoCrmsComAcesso().contains("CRM-010"));
        assertTrue(response.getMedicoCrmsComAcesso().contains("CRM-020"));

        PacienteResponse responseSemNovoCrm = pacienteService.atualizarVinculoMedico("pac-3", "   ", "admin@saude.com");
        assertEquals("", responseSemNovoCrm.getMedicoCrmReferencia());
    }

    @Test
    void deletarQuandoExisteDeveRemoverPaciente() {
        when(pacienteRepository.existsById("pac-9")).thenReturn(true);

        pacienteService.deletar("pac-9");

        verify(pacienteRepository).deleteById("pac-9");
    }

    @Test
    void deletarQuandoNaoExisteDeveLancarExcecao() {
        when(pacienteRepository.existsById(anyString())).thenReturn(false);

        NoSuchElementException ex = assertThrows(
                NoSuchElementException.class,
                () -> pacienteService.deletar("pac-404")
        );

        assertEquals("Paciente não encontrado", ex.getMessage());
        verify(pacienteRepository, times(0)).deleteById(anyString());
    }

    private PacienteRequest novoRequest() {
        PacienteRequest request = new PacienteRequest();
        request.setNome("Paciente Teste");
        request.setIdade(31);
        request.setEndereco("Rua Teste, 100");
        request.setAltura(1.70);
        request.setPeso(70.5);
        request.setMedicoCrmReferencia("");
        return request;
    }

    private Paciente novoPaciente(String id, String nome, String endereco, String crmRef) {
        Paciente paciente = new Paciente();
        paciente.setId(id);
        paciente.setNome(nome);
        paciente.setIdade(25);
        paciente.setEndereco(endereco);
        paciente.setAltura(1.72);
        paciente.setPeso(67.0);
        paciente.setMedicoCrmReferencia(crmRef);
        paciente.setMedicoCrmsComAcesso(new LinkedHashSet<>(Set.of(crmRef)));
        return paciente;
    }
}
