// P2Pのpeerになるサーバー

const net = require('net');
const uuid = require('uuid');

class Edge {
    constructor(id, port, family, address) {
        this.id = id;
        this.port = port;
        this.family = family;
        this.address = address;
    }
}

class Core {
    constructor(id, port, family, address) {
        this.id = id;
        this.port = port;
        this.family = family;
        this.address = address;
    }
}

class Server {

    edgeList = [];
    coreList = [];

    MESSAGE_ADD_AS_EDGE = 0
    MESSAGE_JOIN_NETWORK = 1
    MESSAGE_ADD_AS_CORE = 2
    MESSAGE_CORE_LIST = 3
    MESSAGE_REMOVE_AS_CORE = 4

    MESSAGE_CHAT = 98
    MESSAGE_CHAT_BROADCAST = 99
    MESSAGE_CHAT_TO_EDGE = 100

    constructor(port, firstAccessPort) {
        this.id = uuid.v4();

        this.server = net.createServer(socket => {
            socket.on('data', data => {
                console.log('-> sevrver receive new message!')
                this.handle(data, socket);
            })
        }).listen(port)

        let address = this.server.address();

        this.coreList.push(new Core(this.id, address.port, address.family, address.address));

        if (firstAccessPort != null) {
            let conn = net.connect(firstAccessPort, 'localhost', () => {
                console.log('connected to server');
                var message = {'type': this.MESSAGE_JOIN_NETWORK, 'id': uuid.v4(),'payload': {'id': this.id, 'port': address.port, 'family': address.family, 'address': address.address}};
                conn.write(JSON.stringify(message));

                conn.on('data', data => {
                    console.log('-> sevrver receive new message!')
                    this.handle(data, conn);
                })
            })
        }
    }

    handle(data, socket) {
        let message = JSON.parse(data.toString());
        console.log(message);
        switch (message['type']) {
            case this.MESSAGE_ADD_AS_EDGE:
                let address = socket.address();
                this.addAsEdge(message['payload']['id'], message['payload']['port'], message['payload']['address']);
                console.log(this.edgeList);
                socket.write(JSON.stringify({'id': message['id'], 'type': this.MESSAGE_CORE_LIST, 'payload': this.makeDictionaryFromCoreList()}));
                break;
            case this.MESSAGE_JOIN_NETWORK:
                this.addAsCore(message['payload']['id'], message['payload']['port'], message['payload']['family'], message['payload']['address']);
                console.log('a core joined this network! welcome');
                console.log(this.coreList);
                socket.write(JSON.stringify({'id': message['id'], 'type': this.MESSAGE_CORE_LIST, 'payload': this.makeDictionaryFromCoreList()}));
                break;
            case this.MESSAGE_CORE_LIST:
                console.log('receive core list!');
                this.coreList = this.makeCoreList(message['payload']);
                console.log(this.coreList);
                this.notifyJoinNetwork();
                break;
            case this.MESSAGE_ADD_AS_CORE:
                this.addAsCore(message['payload']['id'], message['payload']['port'], message['payload']['family'], message['payload']['address']);
                console.log('notifyied a core joined!');
                console.log(this.coreList);
                break;
            case this.MESSAGE_REMOVE_AS_CORE:
                console.log('notified a core remove!')
                this.removeCore(message['payload']['id']);
            case this.MESSAGE_CHAT:
                console.log('get chat message!');
                this.broadcastChat(message['payload']);
            case this.MESSAGE_CHAT_BROADCAST:
                console.log('get broadcast chat message!');
                this.sendChatToEdge(message['payload']);
        }
    }

    addAsEdge(id, port, address) {
        let edge = new Edge(id, port, address);
        this.edgeList.push(edge);
    }

    broadcastChat(payload) {
        this.coreList.forEach(core => {
            let conn = net.connect(core.port, core.address, () => {
                console.log('broadcast chat');
                conn.write(JSON.stringify({'type': this.MESSAGE_CHAT_BROADCAST, 'id': uuid.v4(),'payload': payload}));
            });
        })
    }

    sendChatToEdge(payload) {
        this.edgeList.forEach(edge => {
            let conn = net.connect(edge.port, edge.address, () => {
                console.log('send chat to edge');
                conn.write(JSON.stringify({'type': this.MESSAGE_CHAT_TO_EDGE, 'id': uuid.v4(),'payload': payload}));
            });
        })
    }

    addAsCore(id, port, family, address) {
        var contained = false;
        this.coreList.forEach(core => {
            if(core.id == id) {
                contained = true;
                return;
            }
        })

        if (!contained) {
            let core = new Core(id, port,family, address);
            this.coreList.push(core);
        }
    }

    removeCore(id) {
        let tmpCoreList = this.coreList.filter(core => !(core.id == id));
        console.log(tmpCoreList);
        this.coreList = tmpCoreList;
        console.log(this.coreList);
    }

    makeDictionaryFromCoreList() {
        var coreListDictionary = [];
        this.coreList.forEach(core => {
            let element = {'id': core.id, 'port': core.port, 'family': core.family, 'address': core.address};
            coreListDictionary.push(element);
        });
        return coreListDictionary;
    }

    makeCoreList(coreListDictionary) {
        var tmpCoreList = [];
        coreListDictionary.forEach(element => {
            tmpCoreList.push(new Core(element['id'], element['port'], element['family'], element['address']));
        })
        return tmpCoreList;
    }

    notifyJoinNetwork(){
        this.coreList.forEach(core => {
            let conn = net.connect(core.port, core.address, () => {
                let address = this.server.address();
                conn.write(JSON.stringify({'type': this.MESSAGE_ADD_AS_CORE, 'id': uuid.v4(),'payload': {'id': this.id, 'port': address.port, 'family': address.family, 'address': address.address}}));
            })
        });
    }

    beforeShotdown() {
        console.log('bedoreShotDown!');
        this.coreList.forEach(core => {
            let conn = net.connect(core.port, core.address, () => {
                console.log('notify remove');
                conn.write(JSON.stringify({'type': this.MESSAGE_REMOVE_AS_CORE, 'id': uuid.v4(),'payload': {'id': this.id}}));
            });
        });
    }
    
}

module.exports = Server;