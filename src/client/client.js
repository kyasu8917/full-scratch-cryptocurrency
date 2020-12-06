// 接続済みのソケットにメッセージを送信する

const net = require('net');
const uuid = require('uuid');

const port = process.argv[2];
const address = "127.0.0.1";

class Core {
    constructor(id, port, family, address) {
        this.id = id;
        this.port = port;
        this.family = family;
        this.address = address;
    }
}

var coreList = [];
var messageList = [];

// Alias to net.createConnection(port[, host][, connectListener]).
var client = net.connect(port, address, () => {
    console.log('connected to server');
    var message = {'type': 0, 'id': uuid.v4(), 'payload': {'id': uuid.v4(), 'port': client.address().port, 'address': client.address().hostname}}
    client.write(JSON.stringify(message));
});

client.on('data', (data) => {
    console.log('->client / receive new message!')
    message = JSON.parse(data.toString());
    if (message['type'] == 3) {
        message['payload'].forEach(core => {
            core = new Core(core['id'], core['port'], core['family'], core['address'])
            coreList.push(core);
        })
        console.log(coreList);
        return
    }

    if (message['type'] == 100) {
        console.log('get chat message!')
        getMessgae(message['payload']);
        return
    }
});

client.on('close', () => {
    console.log('close!');
});

sendMessage();


function sendMessage() {
    var username = "yasumoto katsuhito";
    var message = "hello, p2p world";

    var obj = {
        "username": username,
        "message": message
    }

    var json = JSON.stringify({'type': 98, 'payload': obj});
    // メッセージを送信
    client.write(json);
}

function getMessgae(payload) {
    messageList.push(payload)
    console.log(messageList);
}
