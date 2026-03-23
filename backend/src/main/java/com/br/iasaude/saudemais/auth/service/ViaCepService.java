package com.br.iasaude.saudemais.auth.service;

import com.br.iasaude.saudemais.auth.dto.ViaCepResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.NoSuchElementException;

@Service
public class ViaCepService {

    private final RestClient restClient;

    public ViaCepService(RestClient.Builder restClientBuilder,
                         @Value("${viacep.base-url:https://viacep.com.br/ws}") String viaCepBaseUrl) {
        this.restClient = restClientBuilder
                .baseUrl(viaCepBaseUrl)
                .build();
    }

    public ViaCepResponse consultarCep(String cep) {
        String cepNumerico = cep == null ? "" : cep.replaceAll("\\D", "");
        if (cepNumerico.length() != 8) {
            throw new IllegalArgumentException("CEP invalido. Informe 8 digitos.");
        }

        try {
            ViaCepResponse response = restClient.get()
                    .uri("/{cep}/json/", cepNumerico)
                    .retrieve()
                    .body(ViaCepResponse.class);

            if (response == null || Boolean.TRUE.equals(response.getErro())) {
                throw new NoSuchElementException("CEP nao encontrado");
            }

            return response;
        } catch (NoSuchElementException e) {
            throw e;
        } catch (RestClientException e) {
            throw new IllegalStateException("Falha ao consultar ViaCEP", e);
        }
    }
}
