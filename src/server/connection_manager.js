const ConnectionList = require('./connection_list');
const MessageManager = require('./message_manager');
const uuid = require('uuid');
const net = require('net');

class ConnectionManager {
    constructor(id, port, family, address) {
        this.id = id;
        this.port = port;
        this.family = family;
        this.address = address;

        this.messageManager = new MessageManager();
        this.connectionList = new ConnectionList(id, port, family, address);
    }

    handle(data, socket) {
        console.log('receive message!')
        let message = JSON.parse(data.toString());
        switch (message['type']) {
            case this.messageManager.MESSAGE_ADD_AS_EDGE:
                console.log('receive add as edge');
                this.receiveAddAsEdge(message, socket);
                break;
            case this.messageManager.MESSAGE_JOIN_NETWORK:
                console.log('receive join network');
                this.receiveJoinNetwork(message, socket);
                break;
            case this.messageManager.MESSAGE_ADD_AS_CORE:
                console.log('receive add as core');
                this.receiveAddAsCore(message);
                break;
            case this.messageManager.MESSAGE_REMOVE_AS_CORE:
                console.log('receive remove as core');
                this.receiveAddAsCore(message);
                break; 
        }
    }

    joinNetwork(toPort, toAddress) {
        let conn = net.connect(toPort, toAddress, () => {
            console.log('connected to server');
            let message = this.messageManager.buildJoinNetwork(this.id, this.port, this.family, this.address);
            conn.write(message);

            conn.on('data', data => {
                console.log('-> sevrver receive new message!')
                this.joinNetWorkHandler(data);
            })
        })
    }

    leaveNetwork() {
        this.connectionList.coreList.forEach(core => {
            let conn = net.connect(core.port, core.address, () => {
                console.log('notify remove');
                let message = this.messageManager.buildRemoveAsCore(this.id);
                conn.write(message);
            });
        });
    }

    receiveJoinNetwork(message, socket) {
        this.connectionList.addCore(message['payload']['id'], message['payload']['port'], message['payload']['family'], message['payload']['address']);
        socket.write(this.messageManager.buildCoreList(this.connectionList.coreList));
    }

    receiveAddAsEdge(message, socket) {
        this.connectionList.addEdge(message['payload']['id'], message['payload']['port'], message['payload']['address']);
        socket.write(this.messageManager.buildCoreList());
    }

    receiveAddAsCore(message) {
        this.connectionList.addCore(message['payload']['id'], message['payload']['port'], message['payload']['family'], message['payload']['address']);
    }

    receiveRemoveAsCore(message) {
        this.connectionList.removeCore(message['payload']['id']);
    }

    joinNetWorkHandler(data) {
        let message = JSON.parse(data.toString());
        console.log(message);

        if (message['type'] == this.messageManager.MESSAGE_CORE_LIST) {
            console.log('receive core list!');
            this.connectionList.initCoreList(this.messageManager.makeCoreList(message['payload']));
            this.broadcastJoinNetwork();
        }
    }

    broadcastJoinNetwork(){
        this.connectionList.coreList.forEach(core => {
            let conn = net.connect(core.port, core.address, () => {
                let message = this.messageManager.buildAddAsCore(this.id, this.port, this.family, this.address);
                conn.write(message);
            })
        });
    }

}

module.exports = ConnectionManager;