document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const senha = document.getElementById('senha').value;
    const responseMessageDiv = document.getElementById('responseMessage');
    const userDetailsDiv = document.getElementById('userDetails');
    const userDetailsContent = document.getElementById('userDetailsContent');

    responseMessageDiv.style.display = 'none';
    userDetailsDiv.style.display = 'none';
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
            userDetailsContent.textContent = JSON.stringify(result.user, null, 2);
            userDetailsDiv.style.display = 'block';
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
