const EC = require('elliptic').ec;

exports.ec = new EC('secp256k1');

exports.Wallet = class {
    constructor () {
        this.keys = exports.ec.genKeyPair();

        this.publicKey = this.keys.getPublic('hex');
        this.secret = this.keys.getPrivate('hex');
    }
}
