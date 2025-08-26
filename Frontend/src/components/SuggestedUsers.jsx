import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";
import api from "../api/axios";
const SuggestedUsers = () => {
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const [loadingId, setLoadingId] = useState(null);
  const dispatch = useDispatch();

  // Call the hook at the component level
  useGetSuggestedUsers();

  const handleFollow = async (suggestedUserId, isFollowing) => {
    try {
      setLoadingId(suggestedUserId);
      const res = await api.post(
        "/user/follow/${suggestedUserId}",
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Dispatch action to update the Redux store
        dispatch({
          type: "auth/updateFollowStatus",
          payload: {
            suggestedUserId,
            currentUserId: user._id,
            isFollowing: !isFollowing,
          },
        });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to follow/unfollow user"
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((suggestedUser) => {
        const isFollowing = suggestedUser.followers?.includes(user?._id);
        return (
          <div
            key={suggestedUser._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${suggestedUser?._id}`}>
                <Avatar>
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt="post_image"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${suggestedUser?._id}`}>
                    {suggestedUser?.username}
                  </Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {suggestedUser?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <button
              className={`text-xs font-bold cursor-pointer px-3 py-1 rounded ${
                isFollowing
                  ? "bg-muted text-foreground"
                  : "bg-[#3BADF8] text-white"
              } ${loadingId === suggestedUser._id ? "opacity-50" : ""}`}
              disabled={loadingId === suggestedUser._id}
              onClick={() => handleFollow(suggestedUser._id, isFollowing)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
