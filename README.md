# Saúde ++ - Plataforma Médica

## Descrição do Projeto
O **Saúde ++** é uma plataforma web voltada exclusivamente para **profissionais de saúde**, oferecendo acesso centralizado e seguro a **prontuários médicos** e informações de pacientes. O objetivo é facilitar a tomada de decisão clínica, integrando dados de diferentes instituições em um único ambiente.

O sistema permite:
- Consulta de prontuários completos
- Acesso a exames laboratoriais e imagens
- Visualização de histórico de medicamentos
- Registro de observações médicas

## Tecnologias Utilizadas
- **Frontend:** HTML, CSS, Bootstrap
- **Backend:** API para integração e consulta de dados médicos
- **Inteligência Artificial:** Processamento de prontuários e interpretação automática de dados clínicos
- **Banco de Dados:** Estrutura pensada para armazenamento seguro de informações clínicas
- **Design:** Interface moderna e acessível, com foco em eficiência para o médico


Veja a descrição detalhada dos arquivos em cada pasta:

	- [CSS](src/main/resources/static/CSS/README.md)
		- [styleGestor](src/main/resources/static/CSS/styleGestor/README.md)
		- [styleHome](src/main/resources/static/CSS/styleHome/README.md)
		- [styleLogin](src/main/resources/static/CSS/styleLogin/README.md)
		- [styleMedico](src/main/resources/static/CSS/styleMedico/README.md)
		- [styleMedicoAntigo](src/main/resources/static/CSS/styleMedicoAntigo/README.md)
	- [img](src/main/resources/static/img/README.md)
	- [js](src/main/resources/static/js/README.md)

## Como funciona o login e a proteção de páginas

O sistema utiliza autenticação baseada em JWT (JSON Web Token) via cookie para proteger páginas restritas.

### Fluxo de login
1. O usuário acessa a tela de login e informa CRM e senha.
2. O frontend faz um POST para `/api/auth/login`.
3. Se as credenciais estiverem corretas, o backend retorna um JWT e o envia como cookie.
4. O navegador armazena o cookie JWT automaticamente.
5. Ao acessar páginas protegidas, o JS verifica se o cookie JWT existe. Se não existir, redireciona para `/login`.
6. O backend valida o JWT em cada requisição protegida.

### Proteção de páginas
- As páginas protegidas (ex: /medico, /gestor, /prontuario, /novaconsulta) usam a função `protegerPagina()` do JS para garantir que só usuários autenticados acessem o conteúdo.
- O backend também exige JWT válido para acessar endpoints REST protegidos.

### Logout
- O logout remove o cookie JWT e redireciona para a tela de login.

### Observação
- O cookie JWT não é HttpOnly para permitir que o JS do frontend verifique a autenticação.

Veja detalhes técnicos nos READMEs das pastas `auth`, `config` e `static/js`.
