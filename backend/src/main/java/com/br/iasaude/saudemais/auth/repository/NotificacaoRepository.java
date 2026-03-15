package com.br.iasaude.saudemais.auth.repository;

import com.br.iasaude.saudemais.auth.model.Notificacao;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface NotificacaoRepository extends MongoRepository<Notificacao, String> {
    List<Notificacao> findAllByOrderByDataHoraDesc();
    long countByLidaFalse();
}
