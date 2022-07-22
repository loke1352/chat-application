//define all our API routes
 //export const host= "https://vartalap47.herokuapp.com/";
 export const host= "http://localhost:5000";
 export const registerRoute=`${host}/api/auth/register`
 export const loginRoute=`${host}/api/auth/login`
 export const setAvatarRoute=`${host}/api/auth/SetAvatar`
 export const allUsersRoute=`${host}/api/auth/allusers`
 export const sendMessageRoute = `${host}/api/messages/addmsg`
 export const getAllMessagesRoute = `${host}/api/messages/getmsg`
