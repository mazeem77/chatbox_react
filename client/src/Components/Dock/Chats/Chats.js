import React from 'react';
import { useState, useEffect, useContext } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import { UserContext } from '../../../userContext';
import Axios from "axios"
import '../Chats/Chats.css';

function Chats({socket, user_id, username}){

    const {user, setUser}  = useContext(UserContext);
    const [friends, setFriends] = useState(null)
    const [crId, setcrID] = useState(null)

    const [newMessage, setNewMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const [fuser_id, setfUser_id] = useState("");
    const [fusername, setfUsername] = useState("");
    const [ffirst_name, setfFirst_name] = useState("");
    const [flast_name, setfLast_name] = useState("");
    const [femail, setfEmail] = useState("");
    const [fstatus, setfStatus] = useState("");
    const [fabout, setfAbout] = useState("");
    const [fphone_no, setfPhone_no] = useState("");

    const joinRoom = (room) => {
        socket.emit("join_room", room);
    };

    const saveMessage = (Data)=>{
        console.log(Data.room)
        Axios.post("http://localhost:8080/saveMessage", {
            room : Data.room,
            author : user_id,
            message : Data.message,
            time: Data.time
        }).then((response) => {

        });
      };

      const retrieveMessage = (Data)=>{
        console.log(Data.room)
        Axios.post("http://localhost:8080/retrieveMessage", {
            room : crId
        }).then((response) => {
            console.log(response);
        });
      };

    const sendMessage = async () => {
        if (newMessage !== "") {
          const mData = {
            room : crId,
            author : username,
            message : newMessage,
            time : new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
        };
    
        await socket.emit("send_message", mData);

          setMessageList((list) => [...list, mData]);
          saveMessage(mData);
          setNewMessage("");
        }
      };



      const friendlist = ()=>{
        Axios.post("http://localhost:8080/friendlist",{
            user_id: user_id
        }      
        ).then((response) => {
          if(response.data.length === 0){
            console.log("does not Exists!");
          }
          else{
            setFriends(response.data.map(obj => <li className="friendlist" onClick={() => selected(obj.user_id)}><a href='#'>{obj.username + ' (' + obj.user_id + ')'}</a></li>))
          }
        });
      };

      const createChatRoom = (e)=>{
      Axios.post("http://localhost:8080/createChatRoom", {
        user_id: user_id,
        friend_id: e
      }).then((response) => {
          console.log(response);
          console.log("createchatroom");
        if(response.data.code === "ER_BAD_FIELD_ERROR"){
          console.log("does not Exists!");
        }
        else{
            chatRoom(e);
        }
      });
    };


      const chatRoom = (e)=>{
        Axios.post("http://localhost:8080/chatRoom", {
          user_id: user_id,
          friend_id: e
        }).then((response) => {
            console.log("chatroom");
            console.log(response.data[0]);
          if(response.data.code === "ER_BAD_FIELD_ERROR"){
            console.log("does not Exists!");
          }
          else if(response.data.length === 0){
            createChatRoom(e);
          }
          else if(response.data.length === 1){
            setcrID(response.data[0].cr_id);
            joinRoom(response.data[0].cr_id);
          }
        });
      };

      const setLeftPanel = (e)=>{
      Axios.post("http://localhost:8080/setLeftPanel", {
        friend_id: e
      }).then((response) => {
          console.log(response.data[0]);
          if(response.data.length === 0){
            console.log("Does not Exists!");
          }
          if(response.data.length === 1){
            setfUser_id(response.data[0].user_id);
            setfUsername(response.data[0].username);
            setfFirst_name(response.data[0].first_name);
            setfLast_name(response.data[0].last_name);
            setfEmail(response.data[0].email);
            setfStatus(response.data[0].status);
            setfAbout(response.data[0].about);
            setfPhone_no(response.data[0].phone_no);
          }
      });
    };

      function selected(e){
          chatRoom(e);
          setLeftPanel(e);
          retrieveMessage();
        }

      useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data);
          setMessageList((list) => [...list, data]);
        });
      }, [socket]);

    return(
        <div className='outerBox'>
            <div className="leftColumn">
            <div className="upperLeft">
                    <img src="https://www.kindpng.com/picc/m/690-6904538_men-profile-icon-png-image-free-download-searchpng.png" alt="" />
                    <p className="userName">{ffirst_name + " " + flast_name}</p>
                </div>
                <div className="lowerLeft">
                    <p className="title">UserName (id):</p>
                    <p className="details">{fusername + ' (' + fuser_id + ')'}</p>
                    <p className="title">About:</p>
                    <p className="details">{fabout}</p>
                    <p className="title">Phone Number:</p>
                    <p className="details">{fphone_no}</p>
                    <p className="title">Email:</p>
                    <p className="details">{femail}</p>
                    <p className="title">Status:</p>
                    <p className="details">Single</p>
                </div>
            </div>
            <div className="centerColumn">
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                    <div className="message" id={username === messageContent.author ? "you" : "other"}>
                        <div>
                            <div className="message-content">
                                <p>{messageContent.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    </div>
                    );
                })}
                </ScrollToBottom>
        	</div> 
                <div className="messageBox">
                    <div className="messageText">
                        <input type="text" placeholder="Write Message..." value={newMessage} onChange={(event)=>{
                            setNewMessage(event.target.value);
                        }} onKeyPress={(event) => {
                            event.key === "Enter" && sendMessage();
                        }}/>
                    </div>
                    <div className="sendButton">
                        <button type='submit' onClick={sendMessage}><ion-icon size="large" name="send"></ion-icon></button>
                    </div>
                </div>
            </div>
            <div className="rightColumn">
                <div className="upperRight">
                    <p>Friends</p>
                    <button type="button" onClick={friendlist}>reload</button>
                </div>
                <div className="lowerRight">
                    {friends ? friends: null}
                </div>
            </div>
        </div>
    );
}

export default Chats;