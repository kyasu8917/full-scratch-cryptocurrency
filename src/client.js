// 接続済みのソケットにメッセージを送信する

const net = require('net');

const port = 3000;
const host = "localhost";

// Alias to net.createConnection(port[, host][, connectListener]).
const client = net.connect(port, host, () => {
    console.log('connected to server');
    var message = {'protocol': 'protocol_name', 'version': '0.0.1', 'msg_type': 5}
    client.write(JSON.stringify(message));
});

client.on('data', (data) => {
    console.log(data.toString());
});