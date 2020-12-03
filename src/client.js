// 接続済みのソケットにメッセージを送信する

const net = require('net');
const uuid = require('uuid');

const port = process.argv[2];
const host = "localhost";

class Core {
    constructor(port, family, address) {
        this.port = port;
        this.family = family;
        this.address = address;
    }
}

var coreList = [];

// Alias to net.createConnection(port[, host][, connectListener]).
const client = net.connect(port, host, () => {
    console.log('connected to server');
    var message = {'type': 0, 'id': uuid.v4()}
    client.write(JSON.stringify(message));
});

client.on('data', (data) => {
    console.log('->client / receive new message!')
    message = JSON.parse(data.toString());
    message['payload'].forEach(core => {
        core = new Core(core['port'], core['family'], core['address'])
        coreList.push(core);
    })
    console.log(coreList);
});