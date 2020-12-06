// P2Pのpeerになるサーバー
const net = require('net');
const uuid = require('uuid');
const ConnectionManager = require('./connection_manager');
const MessageManager = require('./message_manager');

class Server {

    constructor(port, firstAccessPort) {
        this.server = net.createServer().listen(port);

        this.id = uuid.v4();
        let address = this.server.address();

        this.connectionManager = new ConnectionManager(this.id, address.port, address.family, address.address);
        this.messageManager = new MessageManager();

        this.server.on('connection', socket => {
            socket.on('data', data => {
                this.connectionManager.handle(data, socket);
            });
        });

        if (firstAccessPort != null) {
            this.connectionManager.joinNetwork(firstAccessPort, 'localhost');
        }
        
    }

    beforeShotdown() {
        this.connectionManager.leaveNetwork();
    }
    
}

module.exports = Server;