import {  SOCKET_URL } from "../config/config";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

var socket;
 
const ChatNotify = () => {

    useEffect(()=>{
        socket = io.connect(SOCKET_URL);
        socket?.on("connected", () => {});
        socket.emit("setup", localStorage.getItem("id"));
      
          socket?.on("count", (data) => {   
            toast.info("You have new message")
          });
          return () => {
            socket.disconnect();
          }
      
      },[socket])
    
    
}
 
export default ChatNotify;