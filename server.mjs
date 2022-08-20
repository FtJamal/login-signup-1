import express from 'express'
import cors from "cors"
import { nanoid } from 'nanoid'
import mongoose from 'mongoose';

// mongoose.connect('mongodb+srv://abc:abc@cluster0.uhv9f8j.mongodb.net/?retryWrites=true&w=majority');

/////////////////////////////////////////////////////////////////////////////////////////////////
let dbURI = 'mongodb+srv://abc:abc@cluster0.uhv9f8j.mongodb.net/socialMediaDB?retryWrites=true&w=majority';
mongoose.connect(dbURI);

////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function() {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function() {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function(err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function() {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function() {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

let userBase = [];

app.post(`/signup`, (req, res) => {
    let body = req.body;

    if (!body.firstName
        || !body.lastName
        || !body.email
        || !body.password) {
        res.status(400).send(
            `required fields missing, request example:
            {
                "firstName":"farya",
                "lastName":"jamal",
                "email":"abc@abc.com",
                "password":"1234"
            }`
        );
        return;
    }
    let isFound = false;

    for (let i = 0; i < userBase.length; i++) {
        if (userBase[i].email === body.email.toLowerCase()) {
            isFound = true;
            break;
        }
    }
    if (isFound) {
        res.status(400).send(
            { message: `email ${body.email} already exist` }
        );
        return;
    }

    let newUser = {
        userId: nanoid(),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email.toLowerCase(),
        password: body.password
    }

    userBase.push(newUser);
    res.status(201).send({ message: "user is created" });

});

app.post('/login', (req, res) => {

    let body = req.body;

    if (!body.email || !body.password) {
        res.status(400).send(
            `required fields missing,request example:
        {
            "email": "abc@abc.com" ,
            "password": "1234" 
        }`
        );
        return;
    }
    let isFound = false;

    for (let i = 0; i < userBase.length; i++) {
        if (userBase[i].email === body.email) {
            isFound = true;
            if (userBase[i].password === body.password) {
                res.status(200).send({
                    firstName: userBase[i].firstName,
                    lastName: userBase[i].lastName,
                    email: userBase[i].email,
                    message: `login successful`,
                    token: `some unique token`
                })
                return;

            }
            else {
                res.status(401).send(
                    { message: "incorrect password" }
                )
                return;
            }
        }

    }
    if (!isFound) {
        res.status(404).send(
            { message: "user not found" }
        )
        return;
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})