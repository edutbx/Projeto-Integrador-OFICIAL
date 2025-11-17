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
        // Salva apenas dados não sensíveis (nome, crm) se quiser
        localStorage.setItem('userCrm', data.crm);
        localStorage.setItem('userName', data.nome);
        return data;
    } catch (err) {
        throw err;
    }
}

// Função para verificar se o usuário está autenticado (apenas se o cookie JWT existir)
function isAuthenticated() {
    // Checa se o cookie "jwt" existe
    return document.cookie.split(';').some((c) => c.trim().startsWith('jwt='));
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
    // Remove dados do usuário
    localStorage.removeItem('userCrm');
    localStorage.removeItem('userName');
    // Expira o cookie JWT
    document.cookie = 'jwt=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.href = '/login';
}

// Função para obter o token JWT (caso precise em AJAX)
function getToken() {
    const match = document.cookie.match(/(^| )jwt=([^;]+)/);
    return match ? match[2] : null;
}

// Exemplo de uso:
// Chame protegerPagina() no início das páginas protegidas (medico, gestor, etc)
// ATENÇÃO: Linha comentada para debug temporário
// protegerPagina();
// Chame login(crm, senha) ao submeter o formulário de login
// Chame logout() ao clicar no botão de sair
