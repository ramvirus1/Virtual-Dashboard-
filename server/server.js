var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var bodyparser = require("body-parser");
var port = process.env.port || 3000;

app.use(bodyparser.urlencoded({ extended:true }));
app.use(bodyparser.json);

var clientsConnected = {};
var drawnPaths = [];

io.on("connection",function(socket){
    socket.on("join", function(name){
        clientsConnected[name] = socket.id;
        io.sockets.emit("join",clientsConnected);
    });
    socket.on("userInteraction",function(interaction){
        drawnPaths.push(interaction);
        io.sockets.emit("userInteraction",interaction);
    });
    socket.on("onUserInteractionStart",function(interaction){
        io.sockets.emit("onUserInteractionStart",interaction);
    });
    socket.on("getPreviousUpdates",function(userName){
        io.sockets.connected[clientsConnected[userName.user]].emit("getPreviousUpdates",{previousPaths:drawnPaths});
    });
    // socket.on("message",function(msg){
    //     var message = msg;
    //     console.log(msg);
    //     message.sendTo = clientsConnected[msg.sendTo];
    //     io.sockets.connected[msg.sendTo].emit("message",message);
    // });
    // socket.on("locationUpdates",function(locationPayload){
    //     locationPayload['Id'] = clientsConnected[locationPayload.name];
    //     console.log(locationPayload);
    //     socket.broadcast.emit("locationUpdates",locationPayload);
    // });
    socket.on('disconnect', function () {
        delete clientsConnected[socket.id];
        if(Object.keys(clientsConnected).length){
            socket.broadcast.emit("userDisconnected",clientsConnected); 
        }else{
            socket.broadcast.emit("userDisconnected",{}); 
        }
    });
});

http.listen(port,function(){});