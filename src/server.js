// P2Pのpeerになるサーバー

const net = require('net');
const MessageManager = require('./message-manager');

class Server {

    /*
        @param {number} port 
    */

    messageManager = new MessageManager();

    edgeList = [];
    coreList = [];

    constructor(port) {
        this.server = net.createServer(socket => {
            socket.on('data', data => {
                console.log('receive new message!')
                this.handle(this.messageManager.parse(data));
            })
        }).listen(port)
    }

    handle(message) {
        if(message['status'] == 'success') {
            this.successHandler(message);
        } else {
            this.errorHandler(message);
        }
    }

    successHandler(message) {
        console.log(message);
    }

    errorHandler(message) {

    }

}

module.exports = Server;