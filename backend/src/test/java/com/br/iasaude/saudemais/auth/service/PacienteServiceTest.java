package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.PacienteRequest;
import com.br.iasaude.saudemais.auth.model.Paciente;
import com.br.iasaude.saudemais.auth.repository.PacienteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PacienteServiceTest {

    @Mock
    private PacienteRepository pacienteRepository;

    @InjectMocks
    private PacienteService pacienteService;

    private PacienteRequest request;

    @BeforeEach
    void setup() {
        request = new PacienteRequest();
        request.setNome("  Joao ");
        request.setIdade(30);
        request.setEndereco(" Rua A ");
        request.setAltura(1.8);
        request.setPeso(80.0);
        request.setMedicoCrmReferencia(" CRM123 ");
        request.setMedicoCrmsComAcesso(new LinkedHashSet<>(List.of(" CRM123 ", " CRM999 ")));
    }

    @Test
    void criar_deveNormalizarCamposEPersistir() {
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(inv -> {
            Paciente p = inv.getArgument(0);
            p.setId("p1");
            return p;
        });

        var response = pacienteService.criar(request, "admin");

        assertEquals("p1", response.getId());
        assertEquals("Joao", response.getNome());
        assertEquals("CRM123", response.getMedicoCrmReferencia());
        assertTrue(response.getMedicoCrmsComAcesso().contains("CRM999"));
        assertEquals("CRM123", response.getMedicoCrmsComAcesso().iterator().next());
    }

    @Test
    void listar_deveFiltrarEBuscaCaseInsensitive() {
        Paciente p1 = paciente("1", "Joao", "Rua A", "CRM1");
        Paciente p2 = paciente("2", "Maria", "Rua B", "CRM2");
        when(pacienteRepository.findAll()).thenReturn(List.of(p2, p1));

        var resultado = pacienteService.listar("jo");

        assertEquals(1, resultado.size());
        assertEquals("Joao", resultado.get(0).getNome());
    }

    @Test
    void buscarPorId_quandoNaoExiste_deveLancar() {
        when(pacienteRepository.findById("x")).thenReturn(Optional.empty());

        assertThrows(NoSuchElementException.class, () -> pacienteService.buscarPorId("x"));
    }

    @Test
    void atualizar_deveAtualizarCampos() {
        Paciente existente = paciente("1", "Antigo", "Old", "CRM1");
        when(pacienteRepository.findById("1")).thenReturn(Optional.of(existente));
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = pacienteService.atualizar("1", request, "admin");

        assertEquals("Joao", response.getNome());
        assertEquals("Rua A", response.getEndereco());
        assertEquals("admin", existente.getAtualizadoPor());
    }

    @Test
    void atualizarVinculoMedico_deveAtualizarReferenciaELista() {
        Paciente existente = paciente("1", "Joao", "Rua", "CRM1");
        existente.setMedicoCrmsComAcesso(new LinkedHashSet<>(Set.of("CRM0")));
        when(pacienteRepository.findById("1")).thenReturn(Optional.of(existente));
        when(pacienteRepository.save(any(Paciente.class))).thenAnswer(inv -> inv.getArgument(0));

        var response = pacienteService.atualizarVinculoMedico("1", " CRM9 ", "admin");

        assertEquals("CRM9", response.getMedicoCrmReferencia());
        assertTrue(response.getMedicoCrmsComAcesso().contains("CRM9"));
    }

    @Test
    void deletar_quandoNaoExiste_deveLancar() {
        when(pacienteRepository.existsById("1")).thenReturn(false);

        assertThrows(NoSuchElementException.class, () -> pacienteService.deletar("1"));
    }

    @Test
    void deletar_quandoExiste_deveRemover() {
        when(pacienteRepository.existsById("1")).thenReturn(true);

        pacienteService.deletar("1");

        verify(pacienteRepository).deleteById("1");
    }

    private Paciente paciente(String id, String nome, String endereco, String crm) {
        Paciente p = new Paciente();
        p.setId(id);
        p.setNome(nome);
        p.setEndereco(endereco);
        p.setIdade(30);
        p.setAltura(1.7);
        p.setPeso(70.0);
        p.setMedicoCrmReferencia(crm);
        p.setMedicoCrmsComAcesso(new LinkedHashSet<>(Set.of(crm)));
        return p;
    }
}
