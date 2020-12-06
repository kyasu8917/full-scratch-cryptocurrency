const Block = require('./block');
const crypto = require('crypto');

class BlockchainManager {
    constructor() {
        this.chain = [];
    }

    getHash(block) {
        let blockDictionary = block.toDictionary();
        blockString = JSON.stringify(blockDictionary);
        let hash = crypto.createHash('sha256').update(blockString, 'utf8').digest('hex');
        // ビットコインは二重にハッシュ化するらしい
        // ブロックによってJSONプロパティの順番が変わったりするから、本当はソートしてからJSONにすべき、らしい
    }
}