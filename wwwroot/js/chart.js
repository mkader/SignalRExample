//created new line chart object using Chartist
var lineChart = new Chartist.Line('#ChartArea',
    { labels: [], series: [[]] },
    { low: 0, showArea: true });

// Added in the Startup.cs file to map the incoming requests with the specified path to the specified SignalR Hub. 
var chartHubConnection = new signalR.HubConnectionBuilder().withUrl("/ChartHub").build();

//Disable send button until connection is established. document.getElementById("sendButton").disabled = true; 

//The ChartHub has been invoked, it in turn calls the ValueReceiver method on all connected clients. 
chartHubConnection.on("ValueReceiver", function (chartValue) {
    //It checks to see if the chart value passed to it is a number and has a value. 
    if (chartValue && !isNaN(chartValue)) {
        //It then pushes this value onto the lineChart object and updates the chart. 
        lineChart.data.series[0].push(chartValue); lineChart.update();

        //Then it clears and focus to that text box, ready to receive the next value.
        document.getElementById("ChartValue").value = "";
        document.getElementById("ChartValue").focus();
    }
});

chartHubConnection.start().then(function () {
    document.getElementById("ChartButton").disabled = false;
}).catch(function (err) { return console.error(err.toString()); });

//Added an event listener on the sendButton click, will run for every click to add a value. 
document.getElementById("ChartButton").addEventListener("click", function (event) {
    //Gets the text value and ensures it is parsed to a float.  
    var strValue = document.getElementById("ChartValue").value;
    var chartValue = parseFloat(strValue);

     //Invokes the method on the server called ValueSender (ChartHub class). 
    chartHubConnection.invoke("ValueSender", chartValue).catch(function (err) {
        return console.error(err.toString());
    }); event.preventDefault();
});

//Added an event listener on the enger key, called above sendbutton event
$('#ChartValue').keypress(function (e) {
    var key = e.which; if (key === 13)  // the enter key code.     
    { $('#ChartButton').click(); return false; }
});  
