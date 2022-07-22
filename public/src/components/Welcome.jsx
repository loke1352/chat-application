import React from 'react'
import styled from 'styled-components'
import Robot from "../assets/robot.gif"
import Logout from './Logout'
const Welcome = ({currentUser}) => { //accept and destructure the prop user fron Chat.jsx
  return (
    <Container>  
      <div className='logout'> <Logout/></div>    
        <img src={Robot} hlt="Welcome to our chat application!!"/>
        <h1>
        Welcome, <span>{currentUser.username}</span>
        </h1>
        <h3>Please select a chat to start Messaging!!</h3>
    </Container>
  )
}

const Container =styled.div`
 display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex-direction: column;
  img {
    height: 20rem;
  }
  span {
    color: #4e0eff;
  }
  .logout{
    padding-left: 80%;
    margin-bottom: 10px;
  }
`;
export default Welcome
