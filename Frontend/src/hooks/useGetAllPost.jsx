import { setPosts } from "@/redux/postSlice";
import api from "@/lib/axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await api.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/post/all`,
          {
            withCredentials: true,
          }
        );
        if (res.data.success) {
          console.log(res.data.posts);
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};
export default useGetAllPost;
