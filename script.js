const form = document.getElementById('form-cep')
const deleteButton = document.getElementById('btn-clean')
const cadastrados = []

window.addEventListener('load', () => {
    renderElements()
  });

async function handleForm(event) {
    event.preventDefault()
    try {
        const inputValue = document.getElementById('cep').value
        if(!inputValue || inputValue.length !== 8) {
            renderError()
            return
        }
        const existeCep = verificaSeCepJaExiste(inputValue)
        if(!existeCep) {
            const call = await apiCall(inputValue)
            renderRow(call)
            addAtLocalStorage(call)
        } else {
            alert("Opa, você já cadastrou esse CEP!")
        }
        cleanError()
    } catch(error) {
        console.log(error)
        renderError()
    }    
}

async function apiCall(cepValue) {
    return cep(cepValue).then().catch()
}

function addAtLocalStorage(data) {
    const oldData = JSON.parse(localStorage.getItem('endereco') || '[]');
    console.log(oldData)
    const actualData = JSON.stringify([...oldData, data])
    console.log(actualData)
    localStorage.setItem('endereco', actualData)
    
}

function verificaSeCepJaExiste(cep) {
    return cadastrados.includes(cep)
}
function renderElements() {
    const datas = JSON.parse(localStorage.getItem("endereco"))
    if(datas === null) {
        return
    }
    console.log(datas)
    datas.forEach(data => {
        renderRow(data)
    })
}

function renderRow({cep, street ,neighborhood, city, state }) {
    const table = document.getElementById('enderecos-tbody')
    const tr = document.createElement('tr')
    table.appendChild(tr)
    for(let i = 0; i < 4;i++) {
        const td = document.createElement('td')
        let value = ''
        switch(i) {
            case 0: value = cep 
                break;
            case 1: value = street
                    break;
            case 2: value = neighborhood
                    break;
            case 3: value = city + "/" + state
            
        }
        td.innerText = value
        tr.appendChild(td)
    }

    cleanNotAlreadyHaveData()
    cadastrados.push(cep)
}

function renderError() {
    const error = document.getElementById("error")
    error.innerText = "Você colocou um CEP inválido, por favor coloque uma entrada válida, no formato XXXXXXXX"
    error.style.color = "red"
}

function cleanError() {
    const error = document.getElementById("error")
    error.innerText = ""
}
 
function cleanNotAlreadyHaveData() {
    const emptyData = document.getElementById("start-wrapper")
    emptyData.innerText = ""
}

function cleanTable() {
    const table = document.getElementById('enderecos-tbody')
    const emptyData = document.getElementById("start-wrapper")
    localStorage.clear('endereco')
    table.innerHTML = ""
    emptyData.innerText = "Você ainda nao buscou nenhum endereço, utilize o campo CEP para iniciar a busca"
}

form.addEventListener("submit", handleForm)
deleteButton.addEventListener("click", cleanTable)
