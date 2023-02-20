import React, { useState, useMemo } from "react";
import LoginPage from './Components/LoginPage/LoginPage.js';
import Dock from './Components/Dock/Dock.js';
import io from "socket.io-client";
import Chats from './Components/Dock/Chats/Chats.js';
import { BrowserRouter as Router, Routes, Route, Link, Switch } from 'react-router-dom';
import { UserContext } from "./userContext.js";

const socket = io.connect("http://localhost:8080/")

function App() {

  const [user, setUser] = useState("");
  const providerUser = useMemo(() => ({user, setUser}), [user, setUser]);

  return(
    <Router>
      <UserContext.Provider value = {providerUser}>
        <Routes>
          <Route path= "/" element={<LoginPage socket={socket} />} />
          <Route path= "/dock" element={<Dock socket={socket} />} /> 
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
