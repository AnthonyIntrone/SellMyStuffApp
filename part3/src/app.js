var express = require('express'),
    app = express();

// Web3 with our Ganache chain address 
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:7545/'));

// Our sellMyStuff.sol abi copied from Remix
const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "addUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "int256"
			},
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "deposit",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "removeUser",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "item",
				"type": "int256"
			},
			{
				"name": "cost",
				"type": "int256"
			},
			{
				"name": "recipient",
				"type": "address"
			},
			{
				"name": "seller",
				"type": "address"
			}
		],
		"name": "transaction",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "amount",
				"type": "int256"
			},
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "user",
				"type": "address"
			}
		],
		"name": "checkBalance",
		"outputs": [
			{
				"name": "",
				"type": "int256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
]

// The address contract is deployed to
const address = '0xB64078F6428729Ad4E889FCE3dfe075A8Fb48959';

var sellMyStuffContract = web3.eth.Contract(abi, address);

/* Example calls to the sellMyStuff smart contract.
 * This example uses promise callbacks to:
 * 1.) Deposit '100' into the address 
 * 2.) Wait for it to complete, then call checkBalance
 * 3.) Wait for that to complete, then print out the new balance after deposit. 
 * NOTE: use .send() for functions that modify state (setters), and .call() for getters */
sellMyStuffContract.methods.deposit(100, '0x919940fFAd2Ca64089A1dA818AEbd5542dE0eE13').send(
    {from: '0x0314dC41EbbEdE2e2C15565B41767d81158355a9'}).then(function(r, e) {
    console.log(r);
    sellMyStuffContract.methods.checkBalance('0x919940fFAd2Ca64089A1dA818AEbd5542dE0eE13').call().then(function(r, e) {
        console.log("Balance is now " + r);
    });
});

app.use(express.static(__dirname, { index: 'login.html' }));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/sellMyStuff", { useNewUrlParser: true });

var currLoggedIn = '';

var stuffSchema = new mongoose.Schema({
    user_id: String,
    item_id: Number,
    item_name: String,
    item_cost: Number,
    item_status: String
});

var loginSchema = new mongoose.Schema({
    username: String,
    password: String,
    balance: Number
});

var stuff = mongoose.model("stuff", stuffSchema);
var login = mongoose.model("login", loginSchema);

app.post("/addStuff", (req, res) => {
    var data = new stuff(req.body);
    data.save()
    .then(item => {
        res.send("item saved to database");
        console.log("Saved 'stuff' to database");
        console.log(data);
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });
});

app.post("/getStuff", (req, res) => {
    stuff.find({}, function (err, stuff) {
        if (stuff) {
            console.log("Printing stuff:");
            console.log(stuff);
            res.send(stuff);
        }
    });
});

app.post("/getUser", (req, res) => {
    login.findOne({username: currLoggedIn}, function (err, user) {
        if (user) {
                console.log("User found!");
                console.log(user);
                res.send(user);
        }
        else {
            console.log("Woah something went horribly wrong");
        }
    });
});

app.post("/login", (req, res) => {
    login.findOne({username: req.body.username}, function (err, user) {
        if (user) {
            if (req.body.password == user.password) {
                console.log("Login successful!");
                currLoggedIn = req.body.username;
                res.send({valid: true});
            }
            else {
                console.log("Incorrect Password!");
                res.send({valid: false});
            }
        }
        else {
            console.log("User not found!");
            res.send({valid: false});
        }
    });
});

app.post("/createUser", (req, res) => {
    console.log(req.body);
    var data = new login(req.body);
    data.save()
    .then(item => {
        res.send("User created and saved to database");
        console.log("Saved user to database");
        console.log(data);
    })
    .catch(err => {
        res.status(400).send("unable to save to database");
    });
});

app.post("/removeListings", (req, res) => {
    var listings_to_remove = req.body;
    console.log(listings_to_remove);

    for (var i=0; i < listings_to_remove.length; i++) {
        var id = listings_to_remove[i];
        stuff.remove({_id: id}, function(err) {
            if (err) {
                console.log("Deletion failed");
            }
        });
    }

    res.send("Success!");

});

var port = 8080;
app.listen(port, () => {
    console.log("Server listening on port " + port);
});
