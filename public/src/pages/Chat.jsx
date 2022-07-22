import React, { useState, useEffect,useRef} from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute,host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from "socket.io-client"

const Chat = () => {
  const socket =useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]); //to set all the contacts in contacts[] variable array of useState()
  const [currentUser, setCurrentUser] = useState(undefined); //to store current User from localStorage  => for authantication
  const [currentChat,setCurrentChat]=useState(undefined);//currentChat is for the user whom we are chating currently
  const [isLoaded,setIsLoaded]=useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user"))); //set the current user from the localstorage
        setIsLoaded(true); //set it true, as current User set
      }
    };
    fetchData(); //only to prevent async await error in useEffect, bcoz useEffect() don't return anything (nither promises)
  }, []);

  //console.log(currentUser);   //to check who is currentUser(loggedIn user)
useEffect(()=>{
  if(currentUser)
  {
    socket.current=io(host);
    socket.current.emit("add-user",currentUser._id)  //when current user loggedin pass the currentUser Id and
                                                     //add it to global map, that we setup in backend
  }
},[currentUser]);

  useEffect(() => {
    const fetchData=async()=>{
    if (currentUser) {
      //we will call the API
      if (currentUser.isAvatarImageSet) {
        //if user have avatarImage
        const data = await axios.get(`${allUsersRoute}/${currentUser._id}`); //getAllUsers() function will run and we will
        //get all the users except the current user in contact  (check userController.js and APIRoutes.js)
        console.log(data.data);
        setContacts(data.data); //put the data of data object in contacts[] array variable of useState()
      } else {
        //if currentUser don't have avatarImage , navigate to "/setAvatar" to set the avatar image
        navigate("/setAvatar");
      } //giving error with setAvatar check it and deal with it

      const data =await axios.get(`${allUsersRoute}/${currentUser._id}`);
      setContacts(data.data);
    }
  }
  fetchData();
  }, [currentUser]);

  const handleChatChnage=(chat)=>{  //we will pass this function as props in Contacts.jsx, to change the current Chat 
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChnage} />
        {  //use welcome page conditionaly 
         isLoaded && (currentChat === undefined) ?    //if nothing is selected for currentChat
              <Welcome currentUser={currentUser}  />
           :  <ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/> 
        }
      </div>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  color: white;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
export default Chat;
