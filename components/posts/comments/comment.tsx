import classes from './comment.module.css'
import { useSession } from 'next-auth/react';
import {BsTrash3Fill} from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai';
import usePosts from '../../../hooks/usePosts';
import { formatDate } from '../../../lib/formatTime';
interface Like {
    likedBy: string;
  }
interface Comment {
    userId: string;
    userImg:string;
    userName:string;
    _id: string;
    message: string;
    createdAt: string;
    likes: Like[]
  }
  interface UserCommentProps{
    comment:Comment;
    id:string;
  }

function UserComment({comment,id}:UserCommentProps){
  const {deleteComment,likeComment} = usePosts()
    const { data: session, status } = useSession();
    const likesCount = (comment.likes?.length ?? 0)
    const isLikedByUser = comment.likes?.some((like) => like.likedBy === session?.user?.name)

    return  <li key={comment.userId} className={classes.comment}>
    <div className={classes.userImageContainer}>
      <img className={classes.userImage} src={comment.userImg} alt={comment.userName}/>
    </div>
    <div>
      <div className={classes.commentContent}>
        <h4>{comment.userName}</h4>
        <p>{comment.message}</p>
      </div>
      <div className={classes.timestamp}>
<p>{formatDate(comment.createdAt)}</p>
<button className={classes.commentLike} onClick={() =>likeComment(id, comment._id, session?.user?.name)}>Like <AiFillHeart className={`${
          isLikedByUser ? classes["liked"] : "disliked"
      } `} /> ({likesCount})</button>
</div>
      {session?.user?.name === comment.userName && <button className={classes.commentDelete} onClick={() => deleteComment(id,comment._id, session?.user?.name)}><BsTrash3Fill/></button>}
    </div>
  </li>
}
export default UserComment;