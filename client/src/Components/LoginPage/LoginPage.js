import { useState, useContext, useMemo } from "react";
import "./LoginPage.css"
import Axios from "axios"
import Dock from "../Dock/Dock";
import { BrowserRouter as Router, Route, Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../userContext";


function LoginPage({socket}){

  const navigate = useNavigate();

  const {user, setUser}  = useContext(UserContext);

  const [fullName, setFullName] = useState(null);
  const [signUpEmail, setsignUpEmail] = useState(null);
  const [signUpPassword, setsignUpPassword] = useState(null);

  const [loginEmail, setLoginEmail] = useState(null);
  const [loginPassword, setLoginPassword] = useState(null);

  const signUpFunction = ()=>{
    Axios.post("http://localhost:8080/signUpFunction", {
      fullName: fullName,
      signUpEmail: signUpEmail,
      signUpPassword: signUpPassword
    }).then((response) => {
      if(response.data.result){
        console.log(response.data);
        navigate("/");
      }
      else if(!response.data.result){
        if(response.data.code === "ER_DUP_ENTRY"){
          console.log("Email Already Exists");
        }
        else if(response.data.code === "ER_BAD_NULL_ERROR"){
          if(response.data.sqlMessage === "Column 'password' cannot be null"){
            console.log("Password field cannot be Empty!");
          }
          else if(response.data.sqlMessage === "Column 'email' cannot be null"){
            console.log("Email field cannot be Empty!");
          }
          else if(response.data.sqlMessage === "Column 'username' cannot be null"){
            console.log("Full Name field cannot be Empty!");
          }
        }
      }
    });
  };

  const logInFunction = ()=>{
    Axios.post("http://localhost:8080/logInFunction", {
      loginEmail: loginEmail,
      loginPassword: loginPassword
    }).then((response) => {
      if(response.data.length === 0){
        console.log("Email does not Exists!");
      }
      if(response.data.length === 1){
        setUser(response.data[0].user_id);
        navigate("/dock");
      }
    });
  };


  function signupClicked(){
    var signIn = document.getElementById("signIn");
    var signUp = document.getElementById("signUp");
    signIn.style.visibility = "hidden";
    signUp.style.visibility = "visible";
  }
    
  function signinClicked(){
    var signIn = document.getElementById("signIn");
    var signUp = document.getElementById("signUp");
    signIn.style.visibility = "visible";
    signUp.style.visibility = "hidden";
  }
    
  return (
    <div className="outerPart"> 
      <div className="external" id="signIn">
        <form id="signin">
          <h1 id="colorLess">Sign in to ChatBox!</h1>
          <input type="email" name="loginEmail" id="lemail" placeholder="Email" onChange={(event)=>{
            setLoginEmail(event.target.value);
          }}/><br />
          <input type="password" name="loginPassword" id="lpass" placeholder="Password"  onChange={(event)=>{
              setLoginPassword(event.target.value);
            }}/><br />
            <a href="" id="forgot">Forgot your Password?</a><br />
            <button type="button" onClick={logInFunction}>SIGN IN</button>
        </form>
    
            <form className="sideNote" id="rightsideNote">
                <h1 id="colored">Want to Join!</h1>
                <p id="supportingStatement">Join ChatBox to Socialize!!</p>
                <button type="button" onClick={signupClicked}>SIGN UP</button>
            </form>
      </div>
    
      <div className="external" id="signUp">
    
            <form className="sideNote" id="leftsideNote">
                <h1 id="colored">Welcome Back!</h1>
                <p id="supportingStatement">Already Member of ChatBox!!</p>
                <p id="supportingStatement">LogIn your Credentials</p>
                <button type="button" onClick={signinClicked}>SIGN IN</button>
            </form>
    
            <form id="signup">
                <h1 id="colorLess">Register to Chat!</h1>
                <input type="text" name="fullName" id="name" placeholder="Full Name" onChange={(event)=>{
                  if(event.target.value !== ""){
                    setFullName(event.target.value);
                  }
                  else{
                    setFullName(null);
                  }
                }}/>
                <input type="email" name="signUpEmail" id="semail" placeholder="Email" onChange={(event)=>{
                  if(event.target.value !== ""){
                    setsignUpEmail(event.target.value);
                  }
                  else{
                    setsignUpEmail(null);
                  }
                }}/><br />
                <input type="password" name="signUpPassword" id="spass" placeholder="Password" onChange={(event)=>{
                  if(event.target.value !== ""){
                    setsignUpPassword(event.target.value);
                  }
                  else{
                    setsignUpPassword(null);
                  }
                }}/><br />
                <button type="button" onClick={signUpFunction}>SIGN UP</button>
            </form>
        </div>
    </div>
    );
}

export default LoginPage;
