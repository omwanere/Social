import { setSuggestedUsers } from "@/redux/AuthSlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/user/suggested`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestedUsers();
  }, []);
};
export default useGetSuggestedUsers;
