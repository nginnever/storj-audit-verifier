# storj-audit-verifier
Smart contract to verify Storj audits

####Testnet:

Connect to morden testnet

```geth --testnet console```

Create new account if needed

```geth --testnet account new```

You will see a new directory in your .ethereum/testnet folder, wait for the morden testnet to sync up.

Start geth with the following flags, it is important to allow cors headers on the client and enable the rpcapi.

```
geth --rpc --rpcaddr "localhost" --rpcport 8545 --rpccorsdomain "*" --rpcapi="db,eth,net,web3,personal,web3,debug" --datadir "<your geth install path>/.etherum" --unlock "<coinbase>" --testnet console
```

In order to use fileswarm you will need a small amount of ether to start adding yourself to seed contracts and answer challenges. Once challenge cycles have been entered the application will increase the balance of the seeder.

To obtain Morden testnet ether you can try a faucet here:

http://icarus.parity.io/rain/<your_ether_address>

or ZeroGox:

https://zerogox.com/ethereum/wei_faucet