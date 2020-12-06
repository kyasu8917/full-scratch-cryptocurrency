class Block {
    constructor(transaction, previousBlockHash) {
        this.timestamp = Date.now();
        this.transaction = transaction;
        this.previousBlockHash = previousBlockHash;
    }

    toDictionary() {
        return {
            "timestamp": this.timestamp,
            "transaction": JSON.stringify(this.transaction),
            "previousBlockHash": this.previousBlockHash
        }
    }
    
}

module.exports = Block;