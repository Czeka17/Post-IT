import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePostsStore } from "../store/usePostsStore";

interface Like {
    likedBy: string;
}

const useLike = (postId: string, initialLikes: Like[]) => {
    const {  likePost } = usePostsStore(state => ({
		likePost:state.likePost
	  }));
    const { data: session } = useSession();
    const [likesCount, setLikesCount] = useState(initialLikes?.length || 0);
    const [isLikedByUser, setIsLikedByUser] = useState(false);

    useEffect(() => {
        if (initialLikes && session?.user?.name) {
            setIsLikedByUser(initialLikes.some((item) => item.likedBy === session?.user?.name));
            setLikesCount(initialLikes.length);
        }
    }, [initialLikes, session?.user?.name]);

    const toggleLike = async () => {
        if (session?.user?.name) {
            await likePost(postId, session.user.name);
            if (isLikedByUser) {
                setIsLikedByUser(false);
                setLikesCount((prevLikes) => prevLikes - 1);
            } else if(!isLikedByUser) {
                setIsLikedByUser(true);
                setLikesCount((prevLikes) => prevLikes + 1);
            }
        }
    };

    return {
        likesCount,
        isLikedByUser,
        toggleLike,
    };
};

export default useLike;
