# storj-audit-verifier
Smart contract to verify Storj audits

#### Testnet:

Connect to morden testnet

```geth --testnet console```

Create new account if needed

```geth --testnet account new```

You will see a new directory in your .ethereum/testnet folder, wait for the morden testnet to sync up.

Start geth with the following flags, it is important to allow cors headers on the client and enable the rpcapi.

```
geth --rpc --rpcaddr "localhost" --rpcport 8545 --rpccorsdomain "*" --rpcapi="db,eth,net,web3,personal,web3,debug" --datadir "<your geth install path>/.ethereum" --unlock "<coinbase>" --testnet console
```

To obtain Ropsten testnet ether you can try a faucet here:

http://faucet.ropsten.be:3001/