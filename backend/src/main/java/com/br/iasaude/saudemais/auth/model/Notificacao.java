package com.br.iasaude.saudemais.auth.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document("notificacoes")
public class Notificacao {

    @Id
    private String id;
    private String tipo = "SOLICITACAO_CADASTRO";
    private String nomeRemetente;
    private String emailRemetente;
    private String crm;
    private String mensagem;
    private LocalDateTime dataHora;
    private boolean lida = false;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public String getNomeRemetente() { return nomeRemetente; }
    public void setNomeRemetente(String nomeRemetente) { this.nomeRemetente = nomeRemetente; }

    public String getEmailRemetente() { return emailRemetente; }
    public void setEmailRemetente(String emailRemetente) { this.emailRemetente = emailRemetente; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }

    public boolean isLida() { return lida; }
    public void setLida(boolean lida) { this.lida = lida; }
}
