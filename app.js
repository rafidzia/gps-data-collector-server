const express = require('express')
const bodyParser = require('body-parser');
const MongoClient = require("mongodb").MongoClient;
const port = 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

function connect(dbname){
    return new Promise((resolve, reject) => {
        MongoClient.connect("mongodb://localhost", options, (err, client) => {
            if (err) throw (err);
            console.log("database connected");
            resolve(client.db(dbname));
        });
    })
}


(async () => {
    const db = await connect("testlocation");

    app.get("/addstop", async (req, res) => {
        
        var data = {long : req.query.long, lat : req.query.lat}

        await db.collection("busstops").insetOne(data);

        res.send("ok");
    })

    app.listen(port, () => console.log(`App listening at ${port}`))

})()