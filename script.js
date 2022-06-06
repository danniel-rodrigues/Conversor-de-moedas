let timeFormat = (dateTime)  =>  {
    let arr = dateTime.split(' '); // Array contendo data e hora
    let date = arr[0].split('-').reverse().join('/')
    let hour = arr[1]
    let joinDateTime = date + " " + hour;
    
    return joinDateTime;
};

let updateHTML = (data) => {
    dateTime = data.USDBRL.create_date;
    document.getElementById('dolar-update').innerText = parseFloat(data.USDBRL.bid).toPrecision(3);
    document.getElementById('time-update').innerText = timeFormat(dateTime);

};

// Obtém cotação do dólar por meio da AwesomeAPI
let DollarQuote = async() => {
    let url = "https://economia.awesomeapi.com.br/last/USD-BRL";
    let response = await fetch(url);
    let data = await response.json();

    updateHTML(data);
};


DollarQuote();