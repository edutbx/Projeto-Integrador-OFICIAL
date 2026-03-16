package com.br.iasaude.saudemais.auth.dto;

public class NotificacaoRequest {
    private String nomeRemetente;
    private String emailRemetente;
    private String crm;
    private String mensagem;

    public String getNomeRemetente() { return nomeRemetente; }
    public void setNomeRemetente(String nomeRemetente) { this.nomeRemetente = nomeRemetente; }

    public String getEmailRemetente() { return emailRemetente; }
    public void setEmailRemetente(String emailRemetente) { this.emailRemetente = emailRemetente; }

    public String getCrm() { return crm; }
    public void setCrm(String crm) { this.crm = crm; }

    public String getMensagem() { return mensagem; }
    public void setMensagem(String mensagem) { this.mensagem = mensagem; }
}
