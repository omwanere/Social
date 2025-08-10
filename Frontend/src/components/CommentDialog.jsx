import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPost } from "../redux/postSlice";
import { Dialog, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarImage } from "./ui/avatar";
import { setPosts } from "../redux/postSlice";
import { clearLikeNotifications } from "../redux/rtnSlice";
import axios from "axios";

const CommentDialog = ({ open, onOpenChange, selectedPost }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/post/${
          selectedPost?._id
        }/comment`,
        { text: comment },
        { withCredentials: true }
      );
      const updatedPosts = posts.map((post) =>
        post._id === selectedPost._id
          ? { ...post, comments: res.data.comments }
          : post
      );
      dispatch(setPosts(updatedPosts));
      setComment("");
      dispatch(
        setSelectedPost({ ...selectedPost, comments: res.data.comments })
      );
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    onOpenChange(false);
    dispatch(clearLikeNotifications());
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-lg w-full">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={selectedPost?.user?.profilePic} />
          </Avatar>
          <span className="font-semibold text-sm">
            {selectedPost?.user?.username}
          </span>
        </div>
        <div className="mb-4">
          <span className="text-base font-medium">{selectedPost?.caption}</span>
        </div>
        <div className="mb-4 max-h-40 overflow-y-auto">
          {selectedPost?.comments?.map((c, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <Avatar className="w-6 h-6">
                <AvatarImage src={c.user?.profilePic} />
              </Avatar>
              <span className="font-semibold text-xs">{c.user?.username}</span>
              <span className="text-xs">{c.text}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="resize-none"
            rows={2}
            disabled={loading}
          />
          <Button
            onClick={handleAddComment}
            disabled={loading || !comment.trim()}
          >
            {loading ? "Adding..." : "Add Comment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
