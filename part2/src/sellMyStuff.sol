// Part 2: Next add a smart contract and the decentralized elements to that will record all the transactions
// including user management on the blockchain. The transactions could be: register, unregister, buy,
// settlePayment, adddeposit etc. Develop and test this smart contract independently. Difficulty: Medium.

pragma solidity ^0.5.0;

contract sellMyStuff {
    
    /*** State variables ***/
    
    address public user;
    mapping (address => uint) private balances;
    
    /*** Constructor ***/

    // 'Registers' new user
    constructor() public {
        user = msg.sender;
        balances[user] = 0;
    }
    
    /*** Functions ***/
    
    function deposit(uint amount) public {
        uint current_amount = balances[user];
        balances[user] = current_amount + amount;
    }
    
    function getAccountBalance() public view returns (uint) {
        return balances[user];
    }    
    
    function transaction(uint item, uint cost, address recipient, address seller) public {
        assert(balances[recipient] > cost);
        balances[recipient] =  balances[recipient] - cost;
        balances[seller] = balances[seller] + cost;
    }
}
