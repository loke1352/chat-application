const express =require("express")
const mongoose = require("mongoose")
const cors=require("cors");
const socket =require("socket.io");
const userRoutes = require("./routes/userRoutes");
const messageRoutes=require("./routes/messagesRoutes")
const path = require("path");
require("dotenv").config();

const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);

app.use("/",(req,res)=>{
res.send("server is running")
})
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>{
    console.log("DB connection successful...")
})
.catch((err)=>{
    console.log(err.message)
});
const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,()=>{
    console.log(`server is running at port:${PORT}`);
});

const io=socket(server,{
    cors:{
        origin:"http://localhost:3000",    //if you have different origin then provide that origin here
        credentials: true,
    }
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {  //when we have connections, store the chat socket , inside the golbal chat socket
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
//whenever we emit, add user from frontend
//whenever user is loggedin, we stablish a socket connection by add-user && we grab the userId and current socketId and set in map
//whenever send-msg socket event is emitted => we pass data ,this data contain 'to'  & message=> to whome we wanna send messages and 
socket.on("send-msg", (data) => {
   // console.log("sendmsg",{data});
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket)  //if the user is online
    {  
      socket.to(sendUserSocket).emit("msg-recieve", data.message);  //msg ~ message = try to change it
    }
  });
});