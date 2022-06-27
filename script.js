let timeFormat = (dateTime)  =>  {
    let arr = dateTime.split(' '); // Array contendo data e hora
    let date = arr[0].split('-').reverse().join('/')
    let hour = arr[1]
    let joinDateTime = date + " " + hour;
    
    return joinDateTime;
};


let updateHTML = (data) => {
    dateTime = data.USDBRL.create_date;
    dolar_update = parseFloat(data.USDBRL.bid).toPrecision(3);
    document.getElementById('dolar-update').innerText = dolar_update;
    document.getElementById('time-update').innerText = timeFormat(dateTime);

    value_conversion(dolar_update);

};


// Convertendo dolar para real e vice-versa
let value_conversion = (dolar_update) => {
    let dolar = document.getElementById('dolar-value');
    let real = document.getElementById('real-value');

    dolar.value = 1.00.toFixed(2);
    real.value = dolar_update;

    if(dolar.addEventListener('keyup', () => {
        real.value = (dolar_update * dolar.value).toFixed(2);
    }));

    if(real.addEventListener('keyup', () => {
        dolar.value = (real.value / dolar_update).toFixed(2);
    }));
};


// Obtém cotação do dólar por meio da AwesomeAPI
let DollarQuote = async() => {
    let url = "https://economia.awesomeapi.com.br/last/USD-BRL";
    let response = await fetch(url);
    let data = await response.json();

    updateHTML(data);
};


// Atualiza função da cotação do dólar a cada 1 minuto
setInterval(() => { DollarQuote();}, 30000);