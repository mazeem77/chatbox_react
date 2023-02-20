import "./Dock.css"
import {Helmet} from "react-helmet";
import DashBoard from "./DashBoard/DashBoard";
import Chats from "./Chats/Chats.js"
import Notifications from "./Notifications/Notification";
import Settings from "./Settings/Settings";
import { useState, useContext } from 'react'
import Axios from "axios"
import { UserContext } from "../../userContext";


function Dock({socket}){

    const [dashBoardisOpen, setDashBoardopen] = useState(false);
    const [chatisOpen, setChatopen] = useState(false);
    const [notificationisOpen, setNotificationsopen] = useState(false);
    const [settingisOpen, setSettingsopen] = useState(false);

    // setting variable for userInfo
    const [user_id, setUser_id] = useState(false);
    const [username, setUsername] = useState(false);
    const [first_name, setFirst_name] = useState(false);
    const [last_name, setLast_name] = useState(false);
    const [email, setEmail] = useState(false);
    const [status, setStatus] = useState(false);
    const [about, setAbout] = useState(false);
    const [phone_no, setPhone_no] = useState(false);

    const {user, setUser}  = useContext(UserContext);


    const userInfo = ()=>{
        Axios.post("http://localhost:8080/userInfo", {
            user: user
        }).then((response) => {
          if(response.data.length === 0){
            console.log("Does not Exists!");
          }
          if(response.data.length === 1){
            setUser_id(response.data[0].user_id);
            setUsername(response.data[0].username);
            setFirst_name(response.data[0].first_name);
            setLast_name(response.data[0].last_name);
            setEmail(response.data[0].email);
            setStatus(response.data[0].status);
            setAbout(response.data[0].about);
            setPhone_no(response.data[0].phone_no);
          }
        });
      };

    // For DashBoard Handling
    function openDashBoard(){
        setDashBoardopen(true);
        userInfo();
    }

    function closeDashBoard(){
        setDashBoardopen(false);
    }

    //For Chat Handling
    function openChats(){
        setChatopen(true);
        userInfo();
    }

    function closeChats(){
        setChatopen(false);
    }

    //For Notifications Handling
    function openNotifications(){
        setNotificationsopen(true);
        userInfo();
    }

    function closeNotifications(){
        setNotificationsopen(false);
    }

    //For Settings Handling
    function openSettings(){
        setSettingsopen(true);
        userInfo();
    }

    function closeSettings(){
        setSettingsopen(false);
    }

    function active(e){
        if(document.getElementById(e).className == 'list'){
            for(let i = 1; i <= 4; i++){
                document.getElementById(i).className = 'list';
            }
            document.getElementById("yourImage").style.visibility = 'hidden'
            document.getElementById(e).className = 'listActive';
        }
        switch(e){
            case 1: {
                openDashBoard();
                closeChats();
                closeNotifications();
                closeSettings();
                break;
            }

            case 2: {
                closeDashBoard();
                openChats();
                closeNotifications();
                closeSettings();
                break;
            }

            case 3: {
                closeDashBoard();
                closeChats();
                openNotifications();
                closeSettings();
                break;
            }

            case 4: {
                closeDashBoard();
                closeChats();
                closeNotifications();
                openSettings();
                break;
            }
        }
    }

    return(
        <div>
            <div><img id="yourImage" src="../logo192.png" /></div>
            <div className="dock">
            <ul>
                <li className="list" id="1" onClick={() => active(1)}>
                    <a href="#">
                        <div className="indicator" id="indicator1"></div>
                        <span className="icon"><ion-icon name="apps-outline"></ion-icon></span>
                        <span className="text">DashBoard</span>  
                    </a>       
                </li>

                <li className="list" id="2" onClick={() => active(2)}>
                    <a href="#">
                        <div className="indicator" id="indicator2"></div> 
                        <span className="icon"><ion-icon name="chatbubbles-outline"></ion-icon></span>
                        <span className="text">Chats</span>
                    </a>        
                </li>

                <li className="list" id="3" onClick={() => active(3)}>
                    <a href="#">
                        <div className="indicator" id="indicator3"></div>
                        <span className="icon"><ion-icon name="notifications-outline"></ion-icon></span>
                        <span className="text">Notifications</span>
                    </a>                     
                </li>

                <li className="list" id="4" onClick={() => active(4)}>
                    <a href="#">
                        <div className="indicator" id="indicator4"></div>
                        <span className="icon"><ion-icon name="cog-outline"></ion-icon></span>
                        <span className="text">Settings</span>
                    </a>                             
                </li>
            </ul>
            <Helmet>
                <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
                <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
            </Helmet>
        </div>
        
        <div>
            {chatisOpen && <Chats socket={socket} user_id={user_id} username={username}/>}
            {dashBoardisOpen && <DashBoard first_name={first_name} last_name={last_name} about={about} phone_no={phone_no} email={email} user_id={user_id} username={username} />}
            {notificationisOpen && <Notifications />}
            {settingisOpen && <Settings />}
        </div> 
    </div>
    );
}

export default Dock;