const messageModel=require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {  //add messages to database
try{
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
}catch(err){
    next(err);
}
};
module.exports.getAllMessage = async (req, res, next) => {
  try{
  const {from ,to} = req.body;
   const messages=await messageModel.find({
   users:{
    $all : [from,to]   //all the messages from these both the users
   }
   }).sort({updatedAt:1});   //sort the messages according to their updated time
   const projectMessages=messages.map((msg)=>{
    return {
      fromSelf:msg.sender.toString() === from,
      message:msg.message.text,
    }
   });
   res.json(projectMessages);
  }catch(err)
  {
    next(err);
  }
};