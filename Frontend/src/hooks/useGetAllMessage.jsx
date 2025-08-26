import { setMessages } from "@/redux/chatSlice";
import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.auth || {});

  useEffect(() => {
    const fetchAllMessage = async () => {
      if (!selectedUser?._id) {
        dispatch(setMessages([]));
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/message/all/${
            selectedUser._id
          }`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data?.success) {
          dispatch(setMessages(res.data.messages || []));
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError(error);
        dispatch(setMessages([]));
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessage();
  }, [selectedUser?._id, dispatch]);

  return { error, loading };
};

export default useGetAllMessage;
