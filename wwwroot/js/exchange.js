window.setInterval(ExchangeApi, 15000);
//created new line chart object using Chartist
var exchangeLineChart = new Chartist.Line(
    '#ExchangeArea',
    {
        labels: [],
        series: [[]]
    },
    {
        low: 74.18,
        high: 74.24,
        showArea: true
    }
);

// Added in the Startup.cs file to map the incoming requests with the specified path to the specified SignalR Hub. 
var exchangeConnection = new signalR.HubConnectionBuilder().withUrl("/ExchangeHub").build();

//Disable send button until connection is established. document.getElementById("sendButton").disabled = true; 

//The ChartHub has been invoked, it in turn calls the ValueReceiver method on all connected clients. 
exchangeConnection.on("ValueReceiver", function (chartValue) {
    //It checks to see if the chart value passed to it is a number and has a value. 
    if (chartValue && !isNaN(chartValue)) {
        //It then pushes this value onto the lineChart object and updates the chart. 
        exchangeLineChart.data.series[0].push(chartValue);
        exchangeLineChart.update();
    }
});

exchangeConnection.start().then(function () {
    document.getElementById("ExchangeButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

//Added an event listener on the sendButton click, will run for every click to add a value. 
document.getElementById("ExchangeButton").addEventListener("click", function (event) {
    //Gets the text value and ensures it is parsed to a float.  
    var strValue = document.getElementById("ExchangeValue").value;
    var chartValue = parseFloat(strValue);

     //Invokes the method on the server called ValueSender (ChartHub class). 
    exchangeConnection.invoke("ValueSender", chartValue).catch(function (err) {
        return console.error(err.toString());
    }); event.preventDefault();
});

//Added an event listener on the enger key, called above sendbutton event
$('#ExchangeValue').keypress(function (e) {
    var key = e.which;
    if (key === 13)  // the enter key code.     
    {
        $('#ExchangeButton').click();
        return false;
    }
});  

function ExchangeApi() {

    $.ajax({
        type: "GET",
        url: "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=INR&apikey=UKHCKPYSU94IQMAQ",
        dataType: "json",
        success: function (result, status, xhr) {
            var exchRate = result["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
            console.log(exchRate)
            if (exchRate) {
                var exchangeChartValue = parseFloat(exchRate);

                exchangeConnection
                    .invoke("ValueSender", exchangeChartValue)
                    .catch(function (err)
                    {
                        return console.log(err.toString());
                    });
            }

            document.getElementById("ExchangeValue").value = exchRate;
        }, error: function (xhr, status, error) {
            alert("Result: " + status + " " + error + " " + xhr.status + " " + xhr.statusText)
        }
    });
} 