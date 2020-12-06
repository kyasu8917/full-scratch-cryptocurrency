const Core = require('./core');
const Edge = require('./edge');

class ConnectionList {
    
    constructor(id, port, family, address) {
        this.edgeList = [];
        this.coreList = [];

        this.addCore(id, port, family, address);
    }

    addCore(id, port, family, address) {
        if (this.coreList.filter(core => core.id == id).length == 0) {
            this.coreList.push(new Core(id, port, family, address));
            console.log(this.coreList);
        }
    }

    addEdge(id, port, address) {
        this.edgeList.push(new Edge(id, port, address));
    }

    initCoreList(coreList) {
        this.coreList = coreList;
    }

    removeCore(id) {
        let tmpCoreList = this.coreList.filter(core => !(core.id == id));
        this.coreList = tmpCoreList;
        console.log(this.coreList);
    }
}    

module.exports = ConnectionList;