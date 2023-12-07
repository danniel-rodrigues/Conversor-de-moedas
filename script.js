async function getNameOfCurrencies() {
    return fetch('https://economia.awesomeapi.com.br/json/available/uniq')
        .then((data) => data.json())
        .catch((err) => console.log(err))
}

async function formatCurrencyNames() {
    let currencyMap = new Map()
    let data = await getNameOfCurrencies()
    let formattedData = JSON.stringify(data).replace('{',"").replace('}',"")
                    .replaceAll(",", "\n").replaceAll(":", ",").split("\n").sort()

    formattedData.forEach(dataEl => {
        let splittedData = dataEl.replaceAll('\"',"").split(",")
        currencyMap.set(splittedData[0],splittedData[1])
    });

    const sortedAsc = new Map([...currencyMap].sort((a,b) => (a[1] > b[1] ? 1 : -1)))

    sortedAsc.delete("USDT")
    sortedAsc.delete("BRLT")
    sortedAsc.delete("SDR")
    sortedAsc.delete("CHFRTS")
    sortedAsc.delete("JPYRTS")
    sortedAsc.delete("NGNI")
    sortedAsc.delete("NGNPARALLEL")
    sortedAsc.delete("RUBTOD")
    sortedAsc.delete("RUBTOM")
    sortedAsc.delete("XRP")
    sortedAsc.delete("XAU")
    sortedAsc.delete("XAGG")

    sortedAsc.set("TMT", "Manat turcomano")

    return sortedAsc
    
    // let moeda = "Real Brasileiro"

    // currencyMap.forEach((value, key) => {
    //     if(value == moeda) console.log(key)
        
    // })
}


async function addCurrenciesToSelects() {
    let selectTo = document.getElementById("select-to")
    let selectFrom = document.getElementById("select-from")
    
    let teste = await formatCurrencyNames()
    teste.forEach((value,_) => {
        selectTo.innerHTML += `<option>${value}</option>`
        selectFrom.innerHTML += `<option>${value}</option>`
    })

}

addCurrenciesToSelects()