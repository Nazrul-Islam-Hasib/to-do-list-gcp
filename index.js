const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 5000;
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectId;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, "../to-do-list-client/build")));
app.use(express.static(path.join(__dirname,'client', 'build')));

//MongoDb requirements
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@clusterdb.rpg0k.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
//MongoDb CRUD
client.connect(err => {
    console.log("error:", err)
    const toDoCollection = client.db("toDoList").collection("toDo");
    console.log("connected to MongoDb")

    //create services
    app.post('/api/addToDo', (req, res) => {
        const newService = req.body;
        console.log('adding new product',newService);
        toDoCollection.insertOne(newService)
        .then(result => {
            console.log('Inserted count',result.insertedCount);
            res.send(result.insertedCount > 0)
        })
    });

    //Read todo
    app.get('/api/todo', (req, res) => {
        toDoCollection.find()
        .toArray((err, items) => {
            res.send(items);
        })
    })

    //Read single todo
    app.get('/api/todo/:id', (req, res) => {
        toDoCollection.find({_id: ObjectId(req.params.id)})
        .toArray((err, items) => {
            res.send(items[0]);
        })
    })

    //Update todo
    app.patch('/api/update/:id', (req, res) => {
        toDoCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set : {todoName : req.body.updatedToDo}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    //Update StatusTodo
    app.patch('/api/updateStatus/:id', (req, res) => {
        toDoCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set : {completed : req.body.updatedToDo}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    //Delete service
    app.delete('/api/delete/:id', (req, res) => {
        toDoCollection.deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
            res.send(result.deletedCount > 0);
        })
    })
});

app.get('/api/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})