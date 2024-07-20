const express = require("express");
const app = express();
const http = require("http");
const path = require("path")

// setup server and socket io
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);

// setup ejs 


//  establish connection 
io.on("connection", (socket) =>{
    socket.on("send-location", (data)=> {
        io.emit("receive-location", { id:socket.id, ...data})
    })
    console.log("connected to socket")
})
app.get("/", (req,res) =>{
    res.render("index")
})

server.listen(4000, ()=>{
    console.log("Server started successfully");
})