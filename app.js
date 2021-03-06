const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

function connect(dbname){
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://127.0.0.1:27017", options, (err, client) => {
            if (err) throw (err);
            console.log("database connected");
            resolve(client.db(dbname));
        });
    })
}


(async () => {
    var conn = await connect("test");

    app.get("/addstop", async (req, res) => {
        if(!req.query.long || !req.query.lat || !req.query.corridor){
            res.send("longitude and latitude are required");
            return;
        }
        
        var data = {long : req.query.long, lat : req.query.lat, corridor : Number(req.query.corridor), timestamp : new Date().getTime()}

        await conn.collection("busstops").insertOne(data);

        res.send("ok");
    })

    app.get("/addstamp", async (req, res) => {
        if(!req.query.long || !req.query.lat || !req.query.corridor){
            res.send("longitude and latitude are required");
            return;
        }

        var data = {long : req.query.long, lat : req.query.lat, corridor : Number(req.query.corridor), timestamp : new Date().getTime()}

        await conn.collection("gpsstamps").insertOne(data); 

        res.send("ok")
    })  

    app.listen(port, () => console.log(`App listening at ${port}`))

})()