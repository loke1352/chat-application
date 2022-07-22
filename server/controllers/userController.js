const User=require("../model/userModel")
const bcrypt=require("bcrypt")  //encryption of the password


module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)  // if user doesn't exist
      return res.json({ msg: "Incorrect Username or Password", status: false });
      //if user exist then match password
    const isPasswordValid = await bcrypt.compare(password, user.password);//password=>we typed in login page
                                                                      //user.password=>actual password of user
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });

  delete user.password;//delete before sending so that user can't see the password(it won't delete in actual database)
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

 module.exports.register= async (req,res,next)=>{
   try {
      const { username, email, password } = req.body;
      const usernameCheck = await User.findOne({ username });
      if (usernameCheck)
        return res.json({ msg: "Username already used", status: false });
      const emailCheck = await User.findOne({ email });
      if (emailCheck)
        return res.json({ msg: "Email already used", status: false });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      delete user.password;
      return res.json({ status: true, user });
    } catch (err) {
      next(err);
    }
};

module.exports.setAvatar = async (req, res, next) => {
  try{
   const userId = req.params.id;
   const avatarImage = req.body.image;
   const userData=await User.findByIdAndUpdate(userId,{
    isAvatarImageSet:true,
    avatarImage,
   }, { new: true });
   return res.json({
    isSet: userData.isAvatarImageSet,
    image: userData.avatarImage,
   });
  }catch(err){
    next(err);
  }
};

module.exports.getAllUsers=async (req,res,next)=>{
 try{
  const users= await User.find({_id:{$ne:req.params.id}}).select([   //to find all the users except this specific id => use $ne method
  "email",    //we are doing this bcoz user have other data also like: password   and we dono't want to pass this type of data
  "username",    //just think you can see other people password in our whatsapp chat section 😕
  "avatarImage",
  "_id"
  ]);
  return res.json(users);
 }catch(err)
 {
  next(err);
 }
};
