document.addEventListener("DOMContentLoaded", function() {
    const multiStepForm = document.getElementById("cadastroMedicoForm");
    const part1 = document.getElementById("part1");
    const part2 = document.getElementById("part2");
    const part3 = document.getElementById("part3");
    
    const nextToPart2 = document.getElementById("nextToPart2");
    const backToPart1 = document.getElementById("backToPart1");
    const nextToPart3 = document.getElementById("nextToPart3");
    const backToPart2 = document.getElementById("backToPart2");
    
    const pStep1 = document.getElementById("pStep1"); // Corrected ID
    const pStep2 = document.getElementById("pStep2"); // Corrected ID
    const pStep3 = document.getElementById("pStep3"); // Corrected ID
    const pLine1_2 = document.getElementById("pLine1-2"); // Corrected ID
    const pLine2_3 = document.getElementById("pLine2-3"); // Corrected ID

    nextToPart2.addEventListener("click", function() {
        if (validateForm(part1)) {
            part1.classList.remove("active");
            part2.classList.add("active");
            pStep2.classList.add("active");
            pLine1_2.classList.add("active");
        }
    });
    
    backToPart1.addEventListener("click", function() {
        part2.classList.remove("active");
        part1.classList.add("active");
        pStep2.classList.remove("active");
        pLine1_2.classList.remove("active");
    });
    
    nextToPart3.addEventListener("click", function() {
        if (validateForm(part2)) {
            part2.classList.remove("active");
            part3.classList.add("active");
            pStep3.classList.add("active");
            pLine2_3.classList.add("active");
        }
    });
    
    backToPart2.addEventListener("click", function() {
        part3.classList.remove("active");
        part2.classList.add("active");
        pStep3.classList.remove("active");
        pLine2_3.classList.remove("active");
    });

    function validateForm(part) {
        const requiredFields = part.querySelectorAll("[required]");
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = "red";
            } else {
                field.style.borderColor = "";
            }
        });
        
        if (!isValid) {
            alert("Por favor, preencha todos os campos obrigatórios.");
        }
        
        return isValid;
    }

    function gerarSenhaAleatoria(tamanho = 10) {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let senha = "";
        for (let i = 0; i < tamanho; i++) {
            senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return senha;
    }

    multiStepForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        if (!validateForm(part3)) { // Validar a última parte antes de submeter
            return;
        }

        // Coletar dados da Parte 1
        const nomeMedico = document.getElementById("nome").value;
        const sobrenomeMedico = document.getElementById("sobrenome").value;
        const cpfLogin = document.getElementById("cpfLogin").value;
        const cpfMedico = document.getElementById("cpf_medico").value;
        const rgMedico = document.getElementById("rg").value;
        const dataNascMedico = document.getElementById("nascimento").value;
        const sexoMedico = document.getElementById("sexo").value;

        // Coletar dados da Parte 2
        const crmMedico = document.getElementById("crm").value;
        const especializacaoMedico = document.getElementById("especializacao").value;
        const gestorAprovadorId = document.getElementById("gestor_aprovador_id").value || null;

        // Coletar dados da Parte 3
        const cep = document.getElementById("cep").value;
        const logradouro = document.getElementById("endereco").value;
        const numeroEndereco = document.getElementById("numero").value;
        const complementoEndereco = document.getElementById("complemento").value;
        const cidade = document.getElementById("cidade").value;
        const estado = document.getElementById("estado").value;

        const senhaGerada = gerarSenhaAleatoria();
        console.log("Senha gerada para o médico:", senhaGerada);

        const dadosMedico = {
            cpfLogin: cpfLogin,
            senha: senhaGerada,
            nomeMedico: nomeMedico,
            sobrenomeMedico: sobrenomeMedico,
            cpfMedico: cpfMedico,
            rgMedico: rgMedico,
            crmMedico: crmMedico,
            dataNascMedico: dataNascMedico,
            sexoMedico: sexoMedico,
            especializacaoMedico: especializacaoMedico,
            logradouro: logradouro,
            cep: cep,
            cidade: cidade,
            estado: estado,
            numeroEndereco: numeroEndereco,
            complementoEndereco: complementoEndereco,
            gestorAprovadorId: gestorAprovadorId
        };

        let responseMessageDiv = document.getElementById("formResponseMessage");
        // Se não existir, cria e adiciona ao final da parte 3 do formulário
        if (!responseMessageDiv) {
            responseMessageDiv = document.createElement("div");
            responseMessageDiv.id = "formResponseMessage";
            responseMessageDiv.className = "message";
            responseMessageDiv.style.marginTop = "20px"; 
            part3.appendChild(responseMessageDiv);
        }

        responseMessageDiv.textContent = "A processar o seu registo...";
        responseMessageDiv.style.display = "block";
        responseMessageDiv.classList.remove("success", "error");

        try {
            const response = await fetch("http://localhost:3000/api/auth/register/medico", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosMedico)
            });

            const result = await response.json();

            if (response.ok) {
                responseMessageDiv.innerHTML = `Médico registado com sucesso! <br><strong>A senha gerada para o médico é: ${senhaGerada}</strong> <br>Por favor, guarde esta senha num local seguro e informe o médico. (Também exibida no console do navegador).`;
                responseMessageDiv.classList.add("success");
                multiStepForm.reset();
                // Resetar visualização para a primeira parte
                part3.classList.remove("active");
                part2.classList.remove("active");
                part1.classList.add("active");
                pStep2.classList.remove("active");
                pStep3.classList.remove("active");
                pLine1_2.classList.remove("active");
                pLine2_3.classList.remove("active");
            } else {
                responseMessageDiv.textContent = result.message || "Erro ao registar o médico.";
                responseMessageDiv.classList.add("error");
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            responseMessageDiv.textContent = "Ocorreu um erro ao tentar comunicar com o servidor.";
            responseMessageDiv.classList.add("error");
        }
        responseMessageDiv.style.display = "block";
    });
});
