const sha256 = require('crypto-js/sha256');
const { ec } = require('./wallet');

exports.Transaction = class {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
        this.time = new Date().valueOf();

        this.signature = null;
    }

    calculateHash() {
        return sha256(this.from + this.to + this.amount.toString() + this.time.toString()).toString();
    }

    sign(keys) {
        // if (keys.getPublic('hex') !== this.from) {
        //     console.warn('Invalid keys');
        //     return;
        // }

        const transactionHash = this.calculateHash();
        this.signature = keys.sign(transactionHash).toDER('hex');
    }

    isValid() {
        if (!this.signature) {
            console.warn('No signature');
            return false;
        }

        const publicKey = ec.keyFromPublic(this.from, 'hex');

        try {
            return publicKey.verify(this.calculateHash(), this.signature);
        } catch (err) {
            // console.warn(err);
            return false;
        }
    }
}
