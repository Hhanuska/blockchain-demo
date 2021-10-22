const { Block } = require('./block');

exports.BlockChain = class {
    constructor() {
        this.chain = [this.createFirstBlock()];
        this.chain[0].mine();

        this.pendingTransactions = [];
    }

    createFirstBlock() {
        return new Block(null, []);
    }

    getChain() {
        return this.chain;
    }

    getBlock(index) {
        return this.chain[index];
    }

    getLastBlock() {
        return this.getBlock(this.getChain().length - 1);
    }

    queueTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    removeInvalidTransactions() {
        for (let i = this.pendingTransactions.length - 1; i >= 0; i--) {
            if (this.pendingTransactions[i].isValid() === false) {
                this.pendingTransactions.splice(i, 1);
            }
        }
    }

    addBlock() {
        this.removeInvalidTransactions();

        const block = new Block(this.getLastBlock().hash, this.pendingTransactions);
        block.mine();

        this.pendingTransactions = [];

        this.chain.push(block);
    }
}
