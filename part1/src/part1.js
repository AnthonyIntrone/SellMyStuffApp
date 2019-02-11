#!javascript
var express = require('express'),
    app = express();

var port = 8080;

app.use(express.static(__dirname));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/sellMyStuff", { useNewUrlParser: true });

var stuffSchema = new mongoose.Schema({
    user_id: Number,
    item_id: Number,
    item_name: String,
    item_cost: Number,
    item_status: String
});

var stuff = mongoose.model("stuff", stuffSchema);

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
    stuff.findOne({time: req.body.item_id}, function (err, stuff) {
        if (stuff) {
            console.log(stuff);
            res.send(stuff);
        }
    });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
