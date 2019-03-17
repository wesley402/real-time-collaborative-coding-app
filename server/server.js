const express = require('express');
const app = express();
const restRouter = require('./routes/rest');
const indexRouter = require("./routes/index");
const mongoose = require("mongoose");
const path = require("path");
const http = require('http');
const socket_io = require('socket.io');
const io = socket_io();
const socketService = require('./services/SocketService.js')(io);


mongoose.connect('mongodb://user:password1@ds163530.mlab.com:63530/wesley');

app.use(express.static(path.join(__dirname, '../public')));
app.use("/", indexRouter);
app.use("/api/v1", restRouter);
app.use(function(req, res) {
    res.sendFile("index.html", { root: path.join(__dirname, '../public/') });
});
//app.listen(3000, () => console.log('Example app listening on port 3000!'));


var server = http.createServer(app);
io.attach(server);
server.listen(3000);

server.on('error', (err, socket) => {
});
server.on('listening', onListening);


function onListening() {
    var addr = server.address();
    var bind = typeof addr == 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log('Listening on ' + bind);
}
