const router =require("express").Router();
const {register,login,setAvatar, getAllUsers} = require("../controllers/userController")

router.post("/register",register);
router.post("/login",login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id",getAllUsers);  //id is to prevent the display of current user 
                                         //(suppose: in your whatsapp you are also visible with other contacts)

module.exports=router;