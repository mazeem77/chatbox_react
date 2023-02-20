import '../DashBoard/DashBoard.css'
import { UserContext } from '../../../userContext';
import {useContext} from "react"

function DashBoard({first_name, last_name, about, phone_no, email, user_id, username}){

    return(
        <div className='outerBox'>
                <div className="upperLeft">
                    <img src="https://www.kindpng.com/picc/m/690-6904538_men-profile-icon-png-image-free-download-searchpng.png" alt="" />
                    <p className="userName">{first_name + " " + last_name}</p>
                </div>
                <div className="lowerLeft">
                    <p className="title">UserName (id):</p>
                    <p className="details">{username + ' (' + user_id + ')'}</p>
                    <p className="title">About:</p>
                    <p className="details">{about}</p>
                    <p className="title">Phone Number:</p>
                    <p className="details">{phone_no}</p>
                    <p className="title">Email:</p>
                    <p className="details">{email}</p>
                    <p className="title">Status:</p>
                    <p className="details">Single</p>
            </div>
        </div>
    );
}

export default DashBoard;