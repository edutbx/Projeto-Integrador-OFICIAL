// auth.js - Lógica de autenticação e proteção de páginas usando CRM

// Função para realizar login via API usando CRM
async function login(crm, senha) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crm: crm, senha: senha })
        });
        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Erro ao fazer login');
        }
        const data = await response.json();
        // Salva o token JWT no localStorage
        localStorage.setItem('jwt', data.token);
        localStorage.setItem('userCrm', data.crm);
        localStorage.setItem('userName', data.nome);
        return data;
    } catch (err) {
        throw err;
    }
}

// Função para verificar se o usuário está autenticado
function isAuthenticated() {
    return !!localStorage.getItem('jwt');
}

// Função para proteger páginas restritas
function protegerPagina() {
    // Permite acesso livre se o backend expor uma variável global indicando perfil dev
    if (window.perfilDevAtivo) return;
    if (!isAuthenticated()) {
        window.location.href = '/login';
    }
}

// Função para logout
function logout() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('userCrm');
    localStorage.removeItem('userName');
    window.location.href = '/login';
}

// Função para obter o token JWT
function getToken() {
    return localStorage.getItem('jwt');
}

// Exemplo de uso:
// Chame protegerPagina() no início das páginas protegidas (medico, gestor, etc)
// Chame login(crm, senha) ao submeter o formulário de login
// Chame logout() ao clicar no botão de sair
