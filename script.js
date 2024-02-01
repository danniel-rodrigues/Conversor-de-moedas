const fromSelect = document.querySelector("#from-select")
const toSelect = document.querySelector("#to-select")
const convertedValue = document.querySelector("#converted-value")
const valuePrecision = document.querySelector("#value-precision")
const valueConversion = document.querySelector("#value-conversion")


const state = (() => {
    let exchangeRate = {}
    return {
        getExchangeRate: () => exchangeRate,
        setExchangeRate: newExchangeRate => {
            if(!newExchangeRate.conversion_rates) {
                alert("O objeto precisa ter uma propriedade conversion_rates.")
                return
            }
            exchangeRate = newExchangeRate
            return exchangeRate
        }
    }
})()

const internalExchangeRate = state
const APIKey = "0b1ce975e34cbfc6b2688589" 
const getUrl = currency => `https://v6.exchangerate-api.com/v6/${APIKey}/latest/${currency}`

const getErrorMessage = errorType => ({
    "unsupported-code": "A moeda não existe no banco de dados.",
    "malformed-request": "O endpoint do seu request deve seguir a estrutura: https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD",
    "invalid-key": "A chave da API não é válida.",
    "quota-reached": "Sua conta atingiu o limite de requests permitido pelo seu plano.",
    "inactive-account": "Seu endereço de email não foi confirmado."
})[errorType] || "Não foi possível obter as informações."

const fetchExchangeRate = async url => {
    try {
        const response = await fetch(url)

        if(!response.ok) {
            throw new Error("Sua conexão falhou! Não foi possível obter as informações")
        }

        const exchangeRateData = await response.json()

        if(exchangeRateData.result === "error") {
            const errorMessage = getErrorMessage(exchangeRateData["error-type"])
            throw new Error(errorMessage)
        }

        return state.setExchangeRate(exchangeRateData)
    } catch (error) {
        alert(error.message)
    }
}

const getOptions = (selectedCurrency, conversion_rates) => {
    const setSelectAttribute = currency => 
        currency === selectedCurrency ? "selected" : ""
    const getOptionsAsArray = currency => 
        `<option ${setSelectAttribute(currency)}>${currency}</option>`

    return Object.keys(conversion_rates)
        .map(getOptionsAsArray)
        .join("")
}

const getMultipliedExchangeRate = conversion_rates => {
    const currencyTwo = conversion_rates[toSelect.value]
    return (valueConversion.value * currencyTwo).toFixed(2)
}

const getNotRoundedExchangeRate = conversion_rates => {
    const currencyTwo = conversion_rates[toSelect.value]
    return `1 ${fromSelect.value} = ${1 * currencyTwo} ${toSelect.value}`
}

const showUpdatedRates = ({conversion_rates}) => {
    convertedValue.value = getMultipliedExchangeRate(conversion_rates)
    valuePrecision.textContent = getNotRoundedExchangeRate(conversion_rates)
}

const showInitialInfo = ({conversion_rates}) => {
    fromSelect.innerHTML = getOptions("USD", conversion_rates)
    toSelect.innerHTML = getOptions("BRL", conversion_rates)
    
    showUpdatedRates({conversion_rates})
}

const init = async () => {
    const url = getUrl("USD")
    const exchangeRate = await fetchExchangeRate(url)

    if(exchangeRate && exchangeRate.conversion_rates) {
        showInitialInfo(exchangeRate)
    }
}

const handleValueConversionInput = () => {
    const {conversion_rates} = state.getExchangeRate()
    convertedValue.value = getMultipliedExchangeRate(conversion_rates)
}

const handleToSelectInput = () => {
    const exchangeRate = state.getExchangeRate()
    showUpdatedRates(exchangeRate)
}

const handleFromSelectInput = async e => {
    const url = getUrl(e.target.value)
    const exchangeRate = await fetchExchangeRate(url)

    showUpdatedRates(exchangeRate)
}

valueConversion.addEventListener("input", handleValueConversionInput)
toSelect.addEventListener("input", handleToSelectInput)
fromSelect.addEventListener("input", handleFromSelectInput)

init()