import { AiFillHeart, AiOutlineComment } from "react-icons/ai";
import classes from './post-actions.module.css'
import useLike from '../../../hooks/useLikes'
interface Like {
    likedBy: string;
}
    interface PostActionsProps{
        id: string;
        likes: Like[];
        hideCommentsHandler: () => void;
        commentsLength: number;
        showCommentList: (comments: any) => void;
        showComments: boolean;
    }

function PostActions(props: PostActionsProps){
    const { likesCount, isLikedByUser, toggleLike } = useLike(props.id, props.likes);


    return <div className={classes.reaction}>
    <div className={classes.like}>
        <button onClick={toggleLike}>
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
            <button onClick={props.showCommentList}>
                <AiOutlineComment/> ({props.commentsLength})
            </button>
        )}
    </div>
</div>
}

export default PostActions;