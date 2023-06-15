import { useSession } from "next-auth/react";
import {useState} from 'react'
import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import classes from './post-actions.module.css'
interface Like {
	likedBy: string;
}
    interface PostActionsProps{
        id: string
        likes: Like[]
        hideCommentsHandler: () => void
        commentsLength: number
        showCommentList: (comments:any) => void
        showComments: boolean
    }

function PostActions(props: PostActionsProps){
    const [likesCount, setLikesCount] = useState(props.likes.length);
    const { data: session, status } = useSession();
    const [isLikedByUser, setIsLikedByUser] = useState(
		props.likes.some((item) => item.likedBy === session?.user?.name)
	);


    async function likePostHandler() {
		try {
			const response = await fetch("/api/posts/postLikes", {
				method: "POST",
				body: JSON.stringify({
					postId: props.id,
					username: session?.user?.name,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				if (isLikedByUser) {
					setLikesCount((prevCount) => prevCount - 1);
					setIsLikedByUser(false);
				} else {
					setLikesCount((prevCount) => prevCount + 1);
					setIsLikedByUser(true);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

    async function showCommentsHandler(
		event: React.MouseEvent<HTMLButtonElement>
	) {
		event.preventDefault();

		try {
			const response = await fetch("/api/posts/getComments", {
				method: "POST",
				body: JSON.stringify({ postId: props.id }),
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				console.log(data);
				const comments = data.commentList;
				props.showCommentList(comments)
			} else {
				const errorData = await response.json();
				throw new Error(errorData.message || "Something went wrong!");
			}
		} catch (error) {
			console.error(error);
		}
	}
    return <div className={classes.reaction}>
    <div className={classes.like}>
        <button onClick={likePostHandler}>
            <AiFillHeart
                className={`${classes["heart-icon"]} ${
                    isLikedByUser ? classes["liked"] : "disliked"
                } `}
            />
            <p>{likesCount}</p>
        </button>
    </div>
    <div className={classes.showComment}>
        {props.showComments ? (
            <button onClick={props.hideCommentsHandler}><AiOutlineComment/> ({props.commentsLength})</button>
        ) : (
            <button onClick={showCommentsHandler}>
                <AiOutlineComment/> ({props.commentsLength})
            </button>
        )}
    </div>
</div>
}

export default PostActions;