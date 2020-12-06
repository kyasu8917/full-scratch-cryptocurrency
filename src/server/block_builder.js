const Block = require('./block');

class BlockBuilder{
    build(transaction, previousBlockHash) {
        return new Block(transaction, previousBlockHash);
    }
}