import { setSuggestedUsers } from "@/redux/AuthSlice";
import api from "../api/axios"
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  const controllerRef = useRef(new AbortController());
  
  useEffect(() => {
    const controller = controllerRef.current;
    let isMounted = true;

    const fetchSuggestedUsers = async () => {
      try {
        const res = await api.get('/user/suggested', {
          signal: controller.signal
        });
        
        if (isMounted && res?.data?.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching suggested users:', error);
        }
      }
    };
    
    fetchSuggestedUsers();

    // Cleanup function to cancel the request if the component unmounts
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [dispatch]);
};

export default useGetSuggestedUsers;
