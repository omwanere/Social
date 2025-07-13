import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "@/lib/SocketContext";

const useGetRTM = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { messages } = useSelector((store) => store.chat);
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [messages, setMessages, socket, dispatch]);
};
export default useGetRTM;
