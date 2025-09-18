# Pasta controller

A pasta `controller` contém os controllers REST principais do sistema, responsáveis por expor endpoints para funcionalidades do domínio.

## Arquivos
- `MedicoRestController.java`: Endpoint protegido para acesso de médicos autenticados.
- `PdfController.java`: Endpoint para upload e interpretação de PDFs de prontuários, com integração à IA.
- `ProfileController.java`: Endpoint para consulta do perfil de ambiente ativo (ex: se está em modo dev).
- `appController.java`: (não detalhado, mas geralmente serve para rotas genéricas ou de teste).

## O que faz
- Expõe endpoints REST para funcionalidades do sistema (acesso médico, upload de PDF, perfil de ambiente).
- Integra com autenticação JWT e serviços auxiliares.

---

[Voltar ao README principal](../../../../../../README.md)
