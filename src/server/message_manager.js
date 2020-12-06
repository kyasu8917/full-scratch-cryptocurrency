const uuid = require('uuid');
const Core = require('./core');

class MessageManager {
    MESSAGE_ADD_AS_EDGE = 0
    MESSAGE_JOIN_NETWORK = 1
    MESSAGE_ADD_AS_CORE = 2
    MESSAGE_CORE_LIST = 3
    MESSAGE_REMOVE_AS_CORE = 4

    buildJoinNetwork(id, port, family, address) {
        return JSON.stringify({
            'id': uuid.v4(),
            'type': this.MESSAGE_JOIN_NETWORK, 
            'payload': {
                'id': id, 
                'port': port, 
                'family': family, 
                'address': address
            }
        });
    }

    buildAddAsCore(id, port, family, address) {
        return JSON.stringify({
            'id': uuid.v4(),
            'type': this.MESSAGE_ADD_AS_CORE, 
            'payload': {
                'id': id, 
                'port': port, 
                'family': family, 
                'address': address
            }
        })
    }

    buildCoreList(coreList) {
        return JSON.stringify({
            'id': uuid.v4(), 
            'type': this.MESSAGE_CORE_LIST, 
            'payload': this.makeDictionaryFromCoreList(coreList)
        });
    }

    buildRemoveAsCore(id) {
        return JSON.stringify({
            'id': uuid.v4(),
            'type': this.MESSAGE_REMOVE_AS_CORE, 
            'payload': {
                'id': id
            }
        });
    }

    makeCoreList(coreListDictionary) {
        var tmpCoreList = [];
        coreListDictionary.forEach(element => {
            tmpCoreList.push(new Core(element['id'], element['port'], element['family'], element['address']));
        })
        return tmpCoreList;
    }

    makeDictionaryFromCoreList(coreList) {
        var coreListDictionary = [];
        coreList.forEach(core => {
            let element = {'id': core.id, 'port': core.port, 'family': core.family, 'address': core.address};
            coreListDictionary.push(element);
        });
        return coreListDictionary;
    }
}

module.exports = MessageManager;