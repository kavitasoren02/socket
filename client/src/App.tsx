import { useState } from "react";
import "./App.css";
import ChatScreen from "./components/chatscreen";
import JoinScreen from "./components/joinscreen";
import { io, Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

function App() {
  const [currentUser, setCurrentUser] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");

  const joinHandler = (currentUser: string, selectedUser: string) => {
    setCurrentUser(currentUser);
    setSelectedUser(selectedUser);

    socket.emit("user-join", { currentUser, selectedUser });
  };
  return (
    <>
      {currentUser ? (
        <ChatScreen
          currentUser={currentUser}
          selectedUser={selectedUser}
          socket={socket}
        />
      ) : (
        <JoinScreen joinHandler={joinHandler} socket={socket} />
      )}
    </>
  );
}

export default App;
