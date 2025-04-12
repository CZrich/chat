import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Welcome = () => {
  const { setName } = useUser();
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const handleJoin = () => {
    if (input.trim()) {
      setName(input);
      navigate("/chats");
    }
    console.log("no esta entrando", input);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-200 to-rose-100">
    <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
      <h1 className="text-3xl font-bold mb-6 text-rose-500">Welcome to ChatApp!</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
      />
      <button
        onClick={handleJoin}
        className="bg-rose-400 hover:bg-rose-500 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full"
      >
        Join Chat
      </button>
    </div>
  </div>
  );
};
