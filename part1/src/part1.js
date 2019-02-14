#!javascript
var express = require('express'),
    app = express();

var port = 8080;

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

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
