// 接続済みのソケットにメッセージを送信する

const net = require('net');

const port = 3000;
const host = "localhost";

// Alias to net.createConnection(port[, host][, connectListener]).
const client = net.connect(port, host, () => {
    console.log('connected to server');
    var message = 'Hello! This is test message from my sample client!'
    client.write(message);
});

client.on('data', (data) => {
    console.log(data.toString());
});