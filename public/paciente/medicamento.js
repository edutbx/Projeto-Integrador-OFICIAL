const medlist = document.getElementById("medList");
const medInput = document.getElementById("medInput");

// Carrega os medicamentos salvos do localStorage ao iniciar
window.onload = function() {
    const dadosSalvos = JSON.parse(localStorage.getItem("medicamentos"));
    if (dadosSalvos) {
        dadosSalvos.forEach(med => criarElementoMed(med));
    }
};

function adicionarMed() {
    const medText = medInput.value.trim();
    if (medText !== "") {
        criarElementoMed(medText);
        salvarLista();
        medInput.value = "";
    }
}

function criarElementoMed(texto) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${texto}</span>
        <button class="editarButton" onclick="editarMed(this)">Editar</button>
        <button class="deletarButton" onclick="deletarMed(this)">Deletar</button>
    `;
    medlist.appendChild(li);
}

function editarMed(button) {
    const li = button.parentElement;
    const span = li.querySelector("span");
    const novoMed = prompt("Editar Medicamento:", span.textContent);
    if (novoMed !== null && novoMed.trim() !== "") {
        span.textContent = novoMed.trim();
        salvarLista();
    }
}

function deletarMed(button) {
    const li = button.parentElement;
    medlist.removeChild(li);
    salvarLista();
}

function salvarLista() {
    const spans = medlist.querySelectorAll("li span");
    const lista = Array.from(spans).map(span => span.textContent);
    localStorage.setItem("medicamentos", JSON.stringify(lista));
}