/*function dados() {
    let dados = [{ "id": 1, "cpf": "will", "senha": 123 }
    ]
    let n = JSON.stringify(dados);
    sessionStorage.setItem("banco", n);
    return dados
}

function cadastrar() {
    const ClienteArray = JSON.parse(localStorage.getItem("banco"))
    let cpf = document.querySelector("#cpf").value
    let senha = document.querySelector("#senha").value
    let user = { id: Date.now(), cpf: cpf, senha: senha }
    ClienteArray.push(user)
    localStorage.setItem("banco", JSON.stringify(ClienteArray))
    alert("Registro adicionado.")

}

function login() {
    const dados = JSON.parse(localStorage.getItem("banco"))
    let cpf = document.querySelector("#cpf").value
    let senha = document.querySelector("#senha").value

    for (let i = 0; dados.length > i; i++) {
        if (dados[i] == null) {
            alert("Verificando")
            //  alert("encontrou: " + dados[i].nome + ":" + i)
        } else {
            if (cpf == dados[i].cpf && senha == dados[i].senha) {
                console.log("conectado")
                let n = JSON.stringify(dados[i]);
                localStorage.setItem("user", n)
                let url = "homePaciente.html"
                window.open(url)
                window.close(url)
                break
            }
        }
    }
}

function loginMedico() {
    const dados = JSON.parse(localStorage.getItem("banco"))
    let cpf = document.querySelector("#cpf").value
    let senha = document.querySelector("#senha").value

    for (let i = 0; dados.length > i; i++) {
        if (dados[i] == null) {
            alert("Verificando")
            //  alert("encontrou: " + dados[i].nome + ":" + i)
        } else {
            if (cpf == dados[i].cpf && senha == dados[i].senha) {
                console.log("conectado")
                let n = JSON.stringify(dados[i]);
                localStorage.setItem("user", n)
                let url = "homeMedico.html"
                window.open(url)
                window.close(url)
                break
            }
        }
    }
}


function buscar() {
    var dados = JSON.parse(localStorage.getItem("banco"))
    let login = document.querySelector("#login").value

    for (let i = 0; dados.length > i; i++) {
        if (dados[i] == null && dados[i] != login) {
            alert("Verificando")
        } else {
            if (login == dados[i].nome) {
                //alert("encontrou: " + dados[i].nome + ":" + i)
                document.querySelector("#id").value = dados[i].id
                document.querySelector("#login").value = dados[i].nome
                document.querySelector("#senha").value = dados[i].senha
                break
            }
        }
    }
}

function atualizar() {
    var dados = JSON.parse(localStorage.getItem("banco"))
    localStorage.removeItem("banco")
    let id = document.querySelector("#id").value
    let login = document.querySelector("#login").value
    let senha = document.querySelector("#senha").value

    for (let i = 0; dados.length > i; i++) {
        if (id == dados[i].id) {
            let user = { id: id, nome: login, senha: senha }
            dados[i] = user
            localStorage.setItem("banco", JSON.stringify(dados))
            alert("Atualizado!")
            break
        }
    }
}

function apagarItemVetor() {
    let id = parseInt(document.querySelector("#id").value)
    let login = document.querySelector("#login").value
    var dados = JSON.parse(localStorage.getItem("banco"))
    localStorage.removeItem("banco")

    for (let i = 0; dados.length > i; i++) {
        if (dados[i] == null) {
            alert("Verificando")
        } else {
            if (id == dados[i].id && login == dados[i].nome) {
                delete dados[i]
                break;
            }
        }
    }
    localStorage.setItem("banco", JSON.stringify(dados))
}

function limpar() {
    document.querySelector("#id").value = ""
    document.querySelector("#login").value = ""
    document.querySelector("#senha").value = ""
}


function logado() {
    let dados = JSON.parse(localStorage.getItem("user"))
    let nome = dados.nome
    document.getElementById("nome").innerHTML = "Bem vindo " + nome
    return nome
}

function logout() {
    localStorage.removeItem("user")
    let url = "index.html"
    window.open(url)
    window.close(url)
}


document.getElementById('botao-abrir').addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('open-sidebar');
});
*/