const API_URL = "https://economia.awesomeapi.com.br/json/available/uniq"

const getNamesOfCurrencies = () => {
    const options = {
        method: "GET",
        mode: "cors",
        cache: "default"
    }

    fetch(API_URL, options)
    .then(response => response.json())
    .then(data => {
        // Remover elementos específicos do array
        const filteredCurrencies = removeCurrencies(data, [
            "BRLT", "CHFRTS", "JPYRTS", "NGNI", "NGNPARALLEL", "SDR", "RUBTOD", "RUBTOM", "USDT", "XAU", "XAGG"
        ])

        const modifiedCurrencies = modifyCurrencyName(filteredCurrencies, "TMT", "Manat Turcomano")
        
        const sortedCurrencies = alphabeticSort(modifiedCurrencies)

        populateSelects(sortedCurrencies)
    })
    .catch(error => console.log("Erro ao obter dados da API: ", error))
}


// Função para ordenar os nomes das moedas em ordem alfabética
const alphabeticSort = (currencies) => {

    // Convertendo o objeto em um array de pares chave-valor
    let currencyArray = Object.entries(currencies)

    // Ordenando o array com base nos nomes
    currencyArray.sort((a,b) => a[1].localeCompare(b[1]))

    // Convertendo o array de pares chave-valor para objeto novamente
    return Object.fromEntries(currencyArray)
}


// Função para remover elementos do array com base em uma lista de códigos
const removeCurrencies = (currencies, codesToRemove) => {
    const filteredCurrencies = Object.fromEntries(
        Object.entries(currencies).filter(([code,_]) => !codesToRemove.includes(code))
    )
    
    return filteredCurrencies
}


const modifyCurrencyName = (currencies, codeToModify, newName) => {
    // Modificando o nome da moeda no array
    const modifiedArray = Object.entries(currencies).map(([code, name]) => {
        if (code === codeToModify) {
            return [code, newName];
        }
        return [code, name];
    });

    // Convertendo o array de volta para um objeto
    const modifiedObject = Object.fromEntries(modifiedArray);

    return modifiedObject;
};


// Função para popular os selects com os nomes das moedas
const populateSelects = (sortedCurrencies) => {
    let selectFrom = document.getElementById("select-from")
    let selectTo = document.getElementById("select-to")

    for(const [code, name] of Object.entries(sortedCurrencies)) {
        let optionFrom = document.createElement("option")
        optionFrom.value = code
        optionFrom.text = name
        selectFrom.appendChild(optionFrom)
        
        let optionTo = document.createElement("option")
        optionTo.value = code
        optionTo.text = name
        selectTo.appendChild(optionTo)
    }
}

getNamesOfCurrencies()