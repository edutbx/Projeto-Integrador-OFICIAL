document.addEventListener("DOMContentLoaded", () => {
    console.log("Página Meu Perfil carregada. Tentando ler dados do localStorage com a chave 'user'...");

    // Tenta obter os dados do utilizador guardados no localStorage com a chave 'user'
    const userString = localStorage.getItem("user"); // Alterado de "userData" para "user"

    if (userString) {
        console.log("Dados encontrados no localStorage (chave 'user'). Processando...");
        try {
            const userData = JSON.parse(userString);
            console.log("Dados do utilizador:", userData);

            // Preencher os campos no HTML
            // Dados Pessoais
            document.getElementById("perfil-nome").textContent = `${userData.Nome || ""} ${userData.Sobrenome || ""}`.trim();
            document.getElementById("perfil-cpf").textContent = userData.CPF || "Não informado";
            document.getElementById("perfil-data-nasc").textContent = userData.DataNasc ? new Date(userData.DataNasc).toLocaleDateString("pt-BR") : "Não informado";
            document.getElementById("perfil-rg").textContent = userData.RG || "Não informado";
            document.getElementById("perfil-sexo").textContent = userData.Sexo || "Não informado";

            // Dados de Contato
            document.getElementById("perfil-telefone").textContent = userData.Telefone || "Não informado";
            document.getElementById("perfil-email").textContent = userData.Email || "Não informado";

            // Endereço
            if (userData.endereco) {
                const enderecoCompleto = [
                    userData.endereco.Logadouro,
                    userData.endereco.Numero,
                    userData.endereco.Cidade,
                    userData.endereco.Estado,
                    userData.endereco.CEP
                ].filter(Boolean).join(", ");
                document.getElementById("perfil-endereco").textContent = enderecoCompleto || "Não informado";
                document.getElementById("perfil-complemento").textContent = userData.endereco.Complemento || "N/A";
            } else {
                document.getElementById("perfil-endereco").textContent = "Não informado";
                document.getElementById("perfil-complemento").textContent = "N/A";
            }

            console.log("Campos do perfil preenchidos.");

        } catch (error) {
            console.error("Erro ao processar dados do localStorage:", error);
        }
    } else {
        console.warn("Nenhum dado do utilizador encontrado no localStorage (chave 'user'). A página exibirá placeholders ou estará vazia."); // Mensagem atualizada
    }
});

