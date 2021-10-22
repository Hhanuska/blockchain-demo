const sha256 = require('crypto-js/sha256');

exports.MerkleTree = class {
    constructor(transactionList) {
        this.transactions = transactionList.map(t => t.calculateHash());

        this.calculateHashes();
    }

    calculateHashes() {
        if (this.transactions.length % 2) {
            this.transactions.push(this.transactions[this.transactions.length - 1])
        }

        let levels = 0;
        let length = this.transactions.length;
        while (true) {
            if (length % 2 && length !== 1) {
                length++;
            }

            length /= 2;
            levels++;

            if (length <= 1) {
                break;
            }
        }

        // const levels = Math.round(Math.log(this.transactions.length) / Math.log(2));

        const hashes = [[...this.transactions]];

        for (let i = 0; i < levels; i++) {
            hashes.push([]);

            if (hashes[i].length % 2) {
                hashes[i].push(hashes[i][hashes[i].length - 1]);
            }

            for (let j = 0; j < hashes[i].length; j += 2) {
                hashes[i + 1].push(sha256(hashes[i][j] + hashes[i][j + 1]).toString());
            }
        }

        this.hashes = hashes;
    }

    getRootHash() {
        return this.hashes[this.hashes.length - 1][0];
    }
}
