document.addEventListener("DOMContentLoaded", function() {
    const multiStepForm = document.getElementById("multiStepForm");
    const part1 = document.getElementById("part1");
    const part2 = document.getElementById("part2");
    const part3 = document.getElementById("part3");
    
    const nextToPart2 = document.getElementById("nextToPart2");
    const backToPart1 = document.getElementById("backToPart1");
    const nextToPart3 = document.getElementById("nextToPart3");
    const backToPart2 = document.getElementById("backToPart2");
    
    const step2 = document.getElementById("step2");
    const step3 = document.getElementById("step3");
    const line1_2 = document.getElementById("line1-2");
    const line2_3 = document.getElementById("line2-3");

    const selects = document.querySelectorAll(".yes-no-select");
    selects.forEach(select => {
        select.addEventListener("change", function() {
            const detailsId = this.id.replace("-select", "-details");
            const detailsInputContainer = document.getElementById(detailsId);
            
            if (this.value === "sim") {
                detailsInputContainer.classList.add("active");
            } else {
                detailsInputContainer.classList.remove("active");
                const inputField = detailsInputContainer.querySelector("input");
                if (inputField) {
                    inputField.value = "";
                }
            }
        });
    });

    nextToPart2.addEventListener("click", function() {
        if (validateForm(part1)) {
            part1.classList.remove("active");
            part2.classList.add("active");
            step2.classList.add("active");
            line1_2.classList.add("active");
        }
    });
    
    backToPart1.addEventListener("click", function() {
        part2.classList.remove("active");
        part1.classList.add("active");
        step2.classList.remove("active");
        line1_2.classList.remove("active");
    });
    
    nextToPart3.addEventListener("click", function() {
        if (validateForm(part2)) {
            part2.classList.remove("active");
            part3.classList.add("active");
            step3.classList.add("active");
            line2_3.classList.add("active");
        }
    });
    
    backToPart2.addEventListener("click", function() {
        part3.classList.remove("active");
        part2.classList.add("active");
        step3.classList.remove("active");
        line2_3.classList.remove("active");
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

        if (!validateForm(part3)) {
            return;
        }

        const nome = document.getElementById("nome").value;
        const sobrenome = document.getElementById("sobrenome").value;
        const email = document.getElementById("email").value;
        const telefone = document.getElementById("telefone").value;
        const cpf = document.getElementById("cpf").value;
        const rg = document.getElementById("rg").value;
        const nascimento = document.getElementById("nascimento").value;
        const sexoValue = document.getElementById("sexo").value;
        let sexoPaciente;
        if (sexoValue === "masculino") sexoPaciente = "M";
        else if (sexoValue === "feminino") sexoPaciente = "F";
        else sexoPaciente = "O";

        const estado = document.getElementById("estado").value;
        const cidade = document.getElementById("cidade").value;
        const endereco = document.getElementById("endereco").value;
        const cep = document.getElementById("cep").value;
        const numero = document.getElementById("numero").value;
        const complemento = document.getElementById("complemento").value;

        const preCondicao = document.getElementById("condicao-select").value === "sim" ? "S" : "N";
        const alergia = document.getElementById("alergia-select").value === "sim" ? "S" : "N";
        const cirurgia = document.getElementById("cirurgia-select").value === "sim" ? "S" : "N";
        const alcool = document.getElementById("alcool-select").value === "sim" ? "S" : "N";
        const fuma = document.getElementById("fumo-select").value === "sim" ? "S" : "N";

        const senhaGerada = gerarSenhaAleatoria();
        console.log("Senha gerada para o paciente:", senhaGerada); // Adicionado log no console

        const dadosPaciente = {
            cpfLogin: cpf, 
            senha: senhaGerada,
            nomePaciente: nome,
            sobrenomePaciente: sobrenome,
            emailPaciente: email,
            telefonePaciente: telefone,
            rgPaciente: rg,
            dataNascPaciente: nascimento, 
            sexoPaciente: sexoPaciente,
            logradouro: endereco,
            cep: cep,
            cidade: cidade,
            estado: estado,
            numeroEndereco: numero,
            complementoEndereco: complemento,
            preCondicao: preCondicao,
            alergia: alergia,
            cirurgia: cirurgia,
            alcool: alcool,
            fuma: fuma
        };

        let responseMessageDiv = document.getElementById("formResponseMessage");
        if (!responseMessageDiv) {
            responseMessageDiv = document.createElement("div");
            responseMessageDiv.id = "formResponseMessage";
            responseMessageDiv.className = "message";
            responseMessageDiv.style.marginTop = "15px";
            part3.appendChild(responseMessageDiv);
        }

        responseMessageDiv.textContent = "A processar o seu registo...";
        responseMessageDiv.style.display = "block";
        responseMessageDiv.classList.remove("success", "error");

        try {
            const response = await fetch("http://localhost:3000/api/auth/register/paciente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dadosPaciente)
            });

            const result = await response.json();

            if (response.ok) {
                responseMessageDiv.innerHTML = `Paciente registado com sucesso! <br><strong>A senha gerada para o paciente é: ${senhaGerada}</strong> <br>Por favor, guarde esta senha num local seguro e informe o paciente. (Também exibida no console do navegador).`;
                responseMessageDiv.classList.add("success");
                multiStepForm.reset();
                part3.classList.remove("active");
                part1.classList.add("active");
                step2.classList.remove("active");
                step3.classList.remove("active");
                line1_2.classList.remove("active");
                line2_3.classList.remove("active");
                selects.forEach(select => {
                    const detailsId = select.id.replace("-select", "-details");
                    const detailsInputContainer = document.getElementById(detailsId);
                    detailsInputContainer.classList.remove("active");
                    const inputField = detailsInputContainer.querySelector("input");
                    if (inputField) {
                        inputField.value = "";
                    }
                });
            } else {
                responseMessageDiv.textContent = result.message || "Erro ao registar o paciente.";
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
