
# Controllers REST (controller)

A pasta `controller` reúne os controllers REST que expõem as principais funcionalidades do sistema para o frontend e integrações externas.

## Como funciona o fluxo dos controllers

1. **Recebimento de requisições**
	- Cada controller define endpoints REST (ex: `/medico`, `/pdf`, `/profile`) que recebem requisições HTTP do frontend.

2. **Validação e autenticação**
	- Endpoints protegidos exigem autenticação via token JWT, validado automaticamente pelo filtro de segurança.

3. **Processamento da lógica de negócio**
	- Os controllers delegam o processamento para serviços auxiliares (ex: serviços de médico, PDF, integração com IA).

4. **Integração com IA e outros módulos**
	- O `PdfController` pode enviar dados para a IA para interpretação de PDFs.
	- Outros controllers podem acessar dados do usuário autenticado, consultar perfis de ambiente, etc.

5. **Resposta ao cliente**
	- O controller retorna a resposta (JSON, arquivos, etc.) para o frontend, já com as validações e integrações aplicadas.

## Fluxo resumido

Frontend → (requisição HTTP) → Controller → (serviço/IA/autenticação) → Controller → (resposta) → Frontend

## Arquivos principais

- `MedicoRestController.java`: Endpoint protegido para médicos autenticados.
- `PdfController.java`: Upload/interpretação de PDFs e integração com IA.
- `ProfileController.java`: Consulta do perfil de ambiente ativo.
- `appController.java`: Rotas genéricas ou de teste.

## Observações
- Os controllers seguem o padrão REST, facilitando integração e manutenção.
- A autenticação JWT é transparente para os endpoints protegidos.
- A integração com IA ocorre principalmente via `PdfController`.

---

[Voltar ao README principal](../../../../../../README.md)
