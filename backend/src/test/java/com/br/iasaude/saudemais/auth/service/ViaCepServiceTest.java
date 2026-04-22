package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.ViaCepResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.NoSuchElementException;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@SuppressWarnings({"unchecked", "rawtypes"})
@ExtendWith(MockitoExtension.class)
class ViaCepServiceTest {

    @Mock
    private RestClient.Builder builder;

    @Mock
    private RestClient restClient;

    @Mock
    private RestClient.RequestHeadersUriSpec uriSpec;

    @Mock
    private RestClient.RequestHeadersSpec headersSpec;

    @Mock
    private RestClient.ResponseSpec responseSpec;

    @Test
    void consultarCep_quandoCepInvalido_deveLancarIllegalArgument() {
        when(builder.baseUrl(anyString())).thenReturn(builder);
        when(builder.build()).thenReturn(restClient);
        ViaCepService service = new ViaCepService(builder, "https://viacep.com.br/ws");

        assertThrows(IllegalArgumentException.class, () -> service.consultarCep("123"));
    }

    @Test
    void consultarCep_quandoSucesso_deveRetornarResposta() {
        when(builder.baseUrl(anyString())).thenReturn(builder);
        when(builder.build()).thenReturn(restClient);
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(eq("/{cep}/json/"), eq("01001000"))).thenReturn(headersSpec);
        when(headersSpec.retrieve()).thenReturn(responseSpec);
        ViaCepResponse cepResponse = new ViaCepResponse();
        cepResponse.setCep("01001-000");
        when(responseSpec.body(ViaCepResponse.class)).thenReturn(cepResponse);

        ViaCepService service = new ViaCepService(builder, "https://viacep.com.br/ws");
        ViaCepResponse response = service.consultarCep("01001-000");

        assertEquals("01001-000", response.getCep());
    }

    @Test
    void consultarCep_quandoNaoEncontrado_deveLancarNoSuchElement() {
        when(builder.baseUrl(anyString())).thenReturn(builder);
        when(builder.build()).thenReturn(restClient);
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(eq("/{cep}/json/"), eq("01001000"))).thenReturn(headersSpec);
        when(headersSpec.retrieve()).thenReturn(responseSpec);
        ViaCepResponse cepResponse = new ViaCepResponse();
        cepResponse.setErro(true);
        when(responseSpec.body(ViaCepResponse.class)).thenReturn(cepResponse);

        ViaCepService service = new ViaCepService(builder, "https://viacep.com.br/ws");

        assertThrows(NoSuchElementException.class, () -> service.consultarCep("01001000"));
    }

    @Test
    void consultarCep_quandoFalhaCliente_deveLancarIllegalState() {
        when(builder.baseUrl(anyString())).thenReturn(builder);
        when(builder.build()).thenReturn(restClient);
        when(restClient.get()).thenReturn(uriSpec);
        when(uriSpec.uri(eq("/{cep}/json/"), eq("01001000"))).thenReturn(headersSpec);
        when(headersSpec.retrieve()).thenReturn(responseSpec);
        when(responseSpec.body(ViaCepResponse.class)).thenThrow(new RestClientException("falha"));

        ViaCepService service = new ViaCepService(builder, "https://viacep.com.br/ws");

        assertThrows(IllegalStateException.class, () -> service.consultarCep("01001000"));
    }
}
