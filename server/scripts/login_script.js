document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const responseMessageDiv = document.getElementById('responseMessage');

    responseMessageDiv.style.display = 'none';
    responseMessageDiv.className = 'message';

    const data = {
        cpf: cpf,
        senha: senha
    };

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            responseMessageDiv.textContent = result.message || 'Login bem-sucedido!';
            responseMessageDiv.classList.add('success');

            // Verifica o tipo de usuário e redireciona
            if (result.user.TipoUsuario === 'paciente') {
                window.location.href = '/home.html'; // Página do paciente
            } else if (result.user.TipoUsuario === 'medico') {
                window.location.href = '/home.html'; // Página do médico
            } else if (result.user.TipoUsuario === 'gestor') {
                window.location.href = '/home.html'; // Página do administrador
            } else {
                console.error('Tipo de usuário desconhecido:', result.user.tipo);
                responseMessageDiv.textContent = 'Seu tipo de usuário não tem uma página definida.';
                responseMessageDiv.classList.add('error');
            }

            document.getElementById('loginForm').reset();
        } else {
            responseMessageDiv.textContent = result.message || 'Erro ao tentar fazer login.';
            responseMessageDiv.classList.add('error');
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        responseMessageDiv.textContent = 'Ocorreu um erro ao tentar comunicar com o servidor.';
        responseMessageDiv.classList.add('error');
    }
    responseMessageDiv.style.display = 'block';
});