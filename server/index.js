const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mysql = require('mysql');
app.use(require('cors')());
app.use(express.json());


var db = mysql.createConnection({
  host: "10.7.40.243",
  user: "root",
  password: "",
  database: "DatabaseSystems"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

// Signup Function

app.post('/signUpFunction', (req, res) => {
  const fullName = req.body.fullName;
  const signUpEmail = req.body.signUpEmail;
  const signUpPassword = req.body.signUpPassword;
  let first_name = null;
  let last_name = null;
  let username = null;
  if(fullName !== null){
    [first_name, last_name] = fullName.split(' ');
    if (last_name !== undefined){
      username = first_name[0].toLowerCase() + last_name.toLowerCase();
    } 
    else{
      username = first_name.toLowerCase();
    }
  }
    
  db.query(
    "INSERT INTO user (username, first_name, last_name, email, password) VALUES (?,?,?,?,?)",
    [username, first_name, last_name, signUpEmail, signUpPassword],
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        res.send({result});
      }
    })
})

// Signup Function END

// LoginFunction

app.post('/logInFunction', (req, res) => {
  const loginEmail = req.body.loginEmail;
  const loginPassword = req.body.loginPassword;
  db.query(
    "SELECT * FROM user WHERE email = ? AND password = ?",
    [loginEmail, loginPassword],
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        res.send(result);
      }
    })
})

// LoginFunctionend

// userInfo

app.post('/userInfo', (req, res) => {
  const user = req.body.user;
  db.query(
    "SELECT * FROM user WHERE user_id = ?",
    [user],
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        res.send(result);
      }
    })
})

// userInfo ends

// friend userInfo

app.post('/setLeftPanel', (req, res) => {
  const user = req.body.friend_id;
  db.query(
    "SELECT * FROM user WHERE user_id = ?",
    [user],
    (err, result) => {
      if(err){
        res.send(err);
      }
      else{
        res.send(result);
      }
    })
})

// friend userInfo ends


// Status update


// Status update ends


// Friend List

app.post('/friendlist', (req, res) => {
  const user_id = req.body.user_id;
  db.query(
    "SELECT username, user_id FROM user WHERE user_id != ?",
    [user_id],
    (err, result) => {
      if(err){
        res.send(err);
        console.log(err);
      }
      else{
        res.send(result);
        console.log(result);
      }
    })
})

//Friend list ends

//ChatRoom
app.post('/chatRoom', (req, res) => {
  const user_id = req.body.user_id;
  const friend_id = req.body.friend_id;
  db.query(
    "SELECT cr_id FROM chat_room WHERE (cr_userid1 = ? AND cr_userid2 = ?) OR (cr_userid1 = ? AND cr_userid2 = ?)",
    [user_id, friend_id, friend_id, user_id],
    (err, result) => {
      if(err){
        res.send(err);
        console.log(err);
      }
      else{
        res.send(result);
        console.log(result);
      }
    })
})
//chatRoom Ends

//createChatRoom
app.post('/createChatRoom', (req, res) => {
  const user_id = req.body.user_id;
  const friend_id = req.body.friend_id;
  db.query(
    "INSERT INTO chat_room(cr_userid1, cr_userid2) VALUES(?,?)",
    [user_id, friend_id],
    (err, result) => {
      if(err){
        res.send(err);
        console.log(err);
      }
      else{
        res.send(result);
        console.log(result);
      }
    })
})
//createChatRoom Ends


//Save Chat
app.post('/saveMessage', (req, res) => {
  const chat_room = req.body.room;
  const sender = req.body.author;
  const time_stamp = req.body.time;
  const message_body = req.body.message;

  db.query(
    "INSERT INTO message(sender, chat_room, message_body) VALUES(?,?,?)",
    [sender, chat_room, message_body],
    (err, result) => {
      if(err){
        res.send(err);
        console.log(err);
      }
      else{
        res.send(result);
        console.log(result);
      }
    })
})
//Save Chat Ends.

//retrieve Chat
app.post('/retrieveMessage', (req, res) => {
  const chat_room = req.body.room;

  db.query(
    "SELECT * FROM chat_room WHERE chat_room = ?",
    [chat_room],
    (err, result) => {
      if(err){
        res.send(err);
        console.log(err);
      }
      else{
        res.send(result);
        console.log(result);
      }
    })
})
//retrieve Chat Ends

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

server.listen(8080, () => {
  console.log("SERVER RUNNING");
});