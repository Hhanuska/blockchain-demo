const { BlockChain } = require("./app/blockChain");
const { MerkleTree } = require("./app/merkleTree");
const { Transaction } = require("./app/transaction");
const { Wallet } = require("./app/wallet");

const blockChain = new BlockChain();

const wallets = {};

wallets.Bob = new Wallet();
wallets.Alice = new Wallet();

addTransactions(
    'Bob',
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 5),
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 3),
    new Transaction(wallets.Alice.publicKey, wallets.Bob.publicKey, 1)
);

blockChain.addBlock();

addTransactions(
    'Alice',
    new Transaction(wallets.Alice.publicKey, wallets.Alice.publicKey, 7),
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 2),
    new Transaction(wallets.Alice.publicKey, wallets.Bob.publicKey, 1),
    new Transaction(wallets.Alice.publicKey, wallets.Bob.publicKey, 7),
    new Transaction(wallets.Alice.publicKey, wallets.Bob.publicKey, 2),
    new Transaction(wallets.Alice.publicKey, wallets.Bob.publicKey, 3)
);

addTransactions(
    'Bob',
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 2),
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 3),
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 4),
    new Transaction(wallets.Bob.publicKey, wallets.Alice.publicKey, 5)
);

blockChain.addBlock();

addTransactions(
    'Alice',
    new Transaction(wallets.Alice.publicKey, wallets.Bob.publicKey, 1)
);

blockChain.addBlock();

for (let i = 0; i < blockChain.getChain().length; i++) {
    // console.log(`Merkle tree of block #${i}:`, blockChain.getBlock(i).merkleTree.getRootHash());
    console.log(`Merkle tree of block #${i}:`, blockChain.getBlock(i).merkleTree);
}

console.log(blockChain.getLastBlock().hash === blockChain.getLastBlock().calculateHash());
// console.log(blockChain.getLastBlock().hash);
console.log(blockChain.getLastBlock().merkleTree.getRootHash() === new MerkleTree(blockChain.getLastBlock().transactions).getRootHash());

blockChain.getLastBlock().transactions[0].amount = 10;
console.log(blockChain.getLastBlock().merkleTree.getRootHash() === new MerkleTree(blockChain.getLastBlock().transactions).getRootHash());
blockChain.getLastBlock().merkleTree = new MerkleTree(blockChain.getLastBlock().transactions);
console.log(blockChain.getLastBlock().hash === blockChain.getLastBlock().calculateHash());
// console.log(blockChain.getLastBlock().calculateHash());

console.log(blockChain);

function addTransactions(owner, ...transactions) {
    for (let i = 0; i < transactions.length; i++) {
        transactions[i].sign(wallets[owner].keys);
        // console.log(transactions[i].isValid());
    
        blockChain.queueTransaction(transactions[i]);
    }
}
