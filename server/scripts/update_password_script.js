document.getElementById("updatePasswordForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const senhaAntiga = document.getElementById("senhaAntiga").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarNovaSenha = document.getElementById("confirmarNovaSenha").value;
    const responseMessageDiv = document.getElementById("responseMessage");

    responseMessageDiv.style.display = "none"; // Esconder mensagem anterior
    responseMessageDiv.className = "message"; // Resetar classes

    if (novaSenha !== confirmarNovaSenha) {
        responseMessageDiv.textContent = "A nova senha e a confirmação não correspondem.";
        responseMessageDiv.classList.add("error");
        responseMessageDiv.style.display = "block";
        return;
    }
    
    if (novaSenha.length < 6) {
        responseMessageDiv.textContent = "A nova senha deve ter pelo menos 6 caracteres.";
        responseMessageDiv.classList.add("error");
        responseMessageDiv.style.display = "block";
        return;
    }

    const data = {
        cpf: cpf,
        novaSenha: novaSenha
    };

    if (senhaAntiga) {
        data.senhaAntiga = senhaAntiga;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/update-password", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            responseMessageDiv.textContent = result.message || "Senha atualizada com sucesso!";
            responseMessageDiv.classList.add("success");
            document.getElementById("updatePasswordForm").reset(); // Limpar formulário
        } else {
            responseMessageDiv.textContent = result.message || "Erro ao atualizar a senha.";
            responseMessageDiv.classList.add("error");
        }
    } catch (error) {
        console.error("Erro na requisição:", error);
        responseMessageDiv.textContent = "Ocorreu um erro ao tentar comunicar com o servidor.";
        responseMessageDiv.classList.add("error");
    }
    responseMessageDiv.style.display = "block";
});
