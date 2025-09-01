import { useEffect, useState, type FormEvent } from "react";
import type { Socket } from "socket.io-client";

interface Props {
  joinHandler: (currentUser: string, selectedUser: string) => void;
  socket: Socket;
}

interface ConnectedUser {
  user: string[];
}

const defaultUser: string[] = ["Vicky", "Kavita"];

const JoinScreen = ({ joinHandler, socket }: Props) => {
  const [currentUser, setCurrentUser] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [users, setUsers] = useState<string[]>(defaultUser);

  const onJoin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    joinHandler(currentUser, selectedUser);
  };

  useEffect(() => {
    socket.on("connected-user", (connectedUser: ConnectedUser) => {
      if (connectedUser.user.length > 0) {
        setUsers(connectedUser.user ?? []);
      } else {
        setUsers(defaultUser);
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white">
      <div className="w-[500px] h-[350px] bg-gray-500 flex flex-col p-6 rounded-lg shadow-lg">
        <h1 className="text-black font-bold text-3xl text-center mb-6">
          Join Screen
        </h1>
        <form className="flex flex-col gap-2 items-center" onSubmit={onJoin}>
          {/* Input in the middle */}
          <div className="flex flex-col flex-grow justify-center items-center">
            <input
              className="w-[400px] h-[40px] px-3 bg-white border border-gray-300 rounded-md"
              type="text"
              value={currentUser}
              onChange={(e) => setCurrentUser(e.target.value)}
              placeholder="Enter your name"
            />

            <select
              className="w-[400px] h-[40px] mt-[10px] bg-white px-3 border border-gray-300 rounded-md"
              onChange={(e) => setSelectedUser(e.target.value)}
              value={selectedUser}
            >
              <option value="">--Select Name --</option>
              {users.map((name, index) => (
                <option key={`${name}-${index}`} value={name}>
                  {name}
                </option>
              ))}
              {/* <option value="op1">Kavita</option>
              <option value="op2">Vicky</option> */}
            </select>

            <button className=" mt-[15px] px-8 py-4 bg-blue-800 tex-xl text-white">
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinScreen;
