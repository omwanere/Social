import { setSuggestedUsers } from "@/redux/AuthSlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await api.get('/user/suggested');
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.error('Error fetching suggested users:', error);
      }
    };
    
    fetchSuggestedUsers();
  }, [dispatch]);
};

export default useGetSuggestedUsers;
