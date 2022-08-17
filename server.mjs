import express from 'express'
import cors from "cors"
import { nanoid } from 'nanoid'

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

let userBase = [];

app.post(`/signup`, (req,res) => {
let body= req.body;

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
let isFound= false;

for (let i=0 ; i<userBase.length; i++){
    if(userBase[i] ===body.email.toLowerCase()){
        isFound=true;
        break;
    }
}
if (isFound){
    res.send(
        {message:`email ${body.email} already exist`}
    );
return;
}

let newUser={
"userId":nanoid(),
"firstName":body.firstName,
"lastName":body.lastName,
"email":body.email.toLowerCase(),
"password":body.password
}

userBase.push(newUser);
res.status(201).send({message:"user is created"})

})

app.post('/login', (req, res) => {

    let body=res.body

    if(body.email || body.passsword){
        res.send(`required fields missing,request example
        {
            "email":abc@abc.com,
            "password":"1234",
        }`
        )
        return;
    }
  let  isFound = false;

  for(let i=0 ; i <userBase.length; i++){
    if(userBase[i].email=== body.email){
        isFound= true;
        if (userBase[i].password===body.passsword){
            res.send({
                    firstName:userBase[i].firstName,
                    lastName:userBase[i].lastName,
                    email:userBase[i].email,
                    message:"login successful",
                    token:"some unique token"
                })
            return;

        }
        else{
            res.send(
              {message:"incorrect password"}  
            )
            return;
        }
    }

  }
  if(!isFound){
    res.send(
      {message:"user not found"}  
    )
  }

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})