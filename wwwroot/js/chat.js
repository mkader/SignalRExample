"use strict";

var chatHubConnection = new signalR.HubConnectionBuilder().withUrl("/ChatHub").build();

//Disable send button until connection is established. document.getElementById("sendButton").disabled = true; 

chatHubConnection.on("MessageReceiver", function (user, message) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var encodedMsg = user + ": " + msg;
    var li = document.createElement("li");

    var currentUser = document.getElementById("ChatName").value;
    if (currentUser === user) {
        li.className = "list-group-item list-group-item-primary";
    }
    else {
        li.className = "list-group-item list-group-item-success";
    }
    li.textContent = encodedMsg;
    document.getElementById("ChatMessagesList").appendChild(li);
});

chatHubConnection.start().then(function () {
    document.getElementById("ChatButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("ChatButton").addEventListener("click", function (event) {
    var user = document.getElementById("ChatName").value;
    var message = document.getElementById("ChatMessage").value;
    chatHubConnection.invoke("MessageSender", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});
