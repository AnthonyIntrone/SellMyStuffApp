# Sell My Stuff - Part 1/2

A completely decentralized marketplace running on the Ethereum blockchain.

## How to run the web application (part 1)

### Linux Instructions
1. Make sure MongoDB is installed for your system, and the `mongod` daemon is running.
2. `cd` into the `part1/src/` directory.
3. Install all node dependencies by executing `npm install`.
4. Execute `npm start` to start the web application on `localhost:8080` (modifiable by editing `part1.js`).

### Windows Instructions
1. Install Linux.
2. Follow Linux instructions above.

## Viewing the Solidity smart contract (part 2) 

Our smart contract can be viewed under `part2/src/sellMyStuff.sol`

## Part 3 (TODO: clean this up)

1. Start Ganache on `127.0.0.1:7545` (Ganache should shart at this network address by default). This starts up the local Ganace chain.
2. Open a truffle console by envoking `sudo truffle console --network development` from the `part3/` directory. This opens a truffle console with a connection to the Ganache chain.
3. Execute `compile` in the truffle console.
4. Execute `migrate` in the truffle console. This deploys the `sellMyStuff.sol` smart contract on the Ganace chain.
* If you see this error when migrating: `Error: Returned values aren't valid, did it run Out of Gas?`, navigate to the `part3/build/contracts` directory and remove the `.json` files in there ('sudo rm *'). Re-compile and migrate afterwards.

## Authors

* **Timothy Chase**
* **Anthony Introne**
