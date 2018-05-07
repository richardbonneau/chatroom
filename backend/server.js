const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.raw({type: '*/*'}))

let serverState = {
    messages: [],
    accounts : []  
}
let sessionInfo = {};

app.post('/signup', (req, res) => {
    parsedBod = JSON.parse(req.body.toString())
    serverState.accounts = serverState.accounts.concat([parsedBod])
    res.send()
})

app.post('/login', (req, res) => {
    let foundExistingAccount = false;
    let whatToSend = 
    parsedBod = JSON.parse(req.body.toString());
    let sessionID = ''+Math.floor(Math.random() * 100000000);
    serverState.accounts.forEach((acc) => {
        if(acc[0] === parsedBod[0] && acc[1] === parsedBod[1]) { // 0: username 1: password
            sessionInfo[sessionID] = {username: parsedBod[0]};
            foundExistingAccount = true;
        }
    })
    if(foundExistingAccount === true) {res.send(JSON.stringify({username: parsedBod[0], sessionID: sessionID}))} // parsedBod[0] is the username to use
    else {res.send("ErrorMessage")}
})

app.post('/getMessages', (req, res) => {
    parsedBod = JSON.parse(req.body.toString());
    if(!sessionInfo[parsedBod.toString()]) {
        res.send("stop you hacker");
    } else {
    res.send(JSON.stringify(serverState.messages));
    }
})

app.post('/submitMessage', (req, res) => {
    parsedBod = JSON.parse(req.body.toString());
    console.log(parsedBod)
    console.log(sessionInfo)
    if(!sessionInfo[parsedBod.sessionID]) {    // if the session id doesnt exists, dont submit the message
        res.send("stop you hacker")
    } else {
        serverState.messages = serverState.messages.concat(parsedBod);
        res.send("success");   
    }

})

app.listen(4000, ()=> console.log("On."))      