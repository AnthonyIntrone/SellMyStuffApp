pragma solidity ^0.5.0;

contract sellMyStuff {
    
    /*** State variables ***/
    
    address private admin;
    mapping (address => int) private balances;
    mapping (address => bool) private registered;
    
    modifier onlyAdmin {
        require(
            msg.sender == admin,
            "Only admin can call this function."
        );
        _;
    }
    
    /*** Constructor ***/

    // 'Registers' new user
    constructor() public {
        admin = msg.sender;
        balances[admin] = 0;
    }
    
    /*** Functions ***/
    
    function addUser(address user, int balance) public {
        balances[user] = balance;
        registered[user] = true;
    }
    
    function removeUser(address user) private onlyAdmin {
        registered[user] = false;
        delete balances[user];
    }
    
    function deposit(int amount, address user) public {
        int current_amount = balances[user];
        balances[user] = current_amount + amount;
    }
    
    function withdraw(int amount, address user) public {
        assert(balances[user] >= amount);
        int current_amount = balances[user];
        balances[user] = current_amount - amount;
    }
    
    function checkBalance(address user) public view returns (int) {
        return balances[user];
    }    
    
    function transaction(int cost, address recipient, address seller) public {
        assert(registered[seller]);
        assert(registered[recipient]);
        assert(balances[recipient] > cost);
        balances[recipient] = balances[recipient] - cost;
        balances[seller] = balances[seller] + cost;
    }
}