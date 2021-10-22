const sha256 = require('crypto-js/sha256');
const { MerkleTree } = require('./merkleTree');

exports.Block = class {
    constructor(prevHash, transactions = [], difficulty = 4) {
        this.nonce = 0;

        this.prevHash = prevHash;
        this.transactions = [...transactions];
        this.merkleTree = new MerkleTree(this.transactions);
        this.difficulty = difficulty;

        this.time = new Date().valueOf();

        this.hash = this.calculateHash();
    }

    checkPoW() {
        const difSubString = new Array(this.difficulty + 1).join('0');

        return this.hash.startsWith(difSubString);
    }

    calculateHash() {
        return sha256(this.prevHash + this.merkleTree.getRootHash() + this.time.toString() + this.nonce.toString()).toString();
    }

    mine() {
        while (!this.checkPoW(this.hash)) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block mined. Hash ${this.hash}`);
    }

    addTransactions(transactions) {
        if(Array.isArray(transactions) === false) {
            transactions = [transactions];
        }

        this.transactions = this.transactions.concat(transactions);
    }
}
