import { setUserProfile } from "@/redux/AuthSlice";
import api from "../api/axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();
  // const [userProfile, setUserProfile] = useState(null);
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get(
          `${
            import.meta.env.VITE_BACKEND_BASEURL
          }/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUserProfile();
  }, [userId]);
};
export default useGetUserProfile;
